import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GapService } from 'app/services/gap.service';
import { Evaluation } from 'app/models/evaluation';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { ControlEvaluation } from 'app/models/control-evaluation';
import { Requirement } from 'app/models/requirement';
import { Control } from 'app/models/control';
import { MaturityLevel } from 'app/models/maturity-level';
import { Responsible } from 'app/models/responsible';
import { ErrorManager } from 'app/errors/error-manager';

interface GapItem {
  tipo: 'requisito' | 'control';
  theme: string;
  evaluacion: RequirementEvaluation | ControlEvaluation;
}

interface ThemeRowSegment {
  name: string;
  color: string;
  count: number;
}

interface ThemeRow {
  theme: string;
  total: number;
  evaluados: number;
  segments: ThemeRowSegment[];
  pendiente: number;
}

const PAGE_SIZE = 30;

/**
 * "Análisis del GAP" — mismo diseño que antes (header %, mapa de brecha por tema, buscador,
 * filtro por tema, lista de ítems evaluables), pero ya no carga todo de una vez.
 *
 * Antes: un solo GET /api/gap/evaluacion traía el árbol completo (requisitos + grupos de
 * controles con sus ~180 evaluaciones anidadas) y todo — stats/temaRows/countEstado/filtrado
 * por búsqueda — se recalculaba client-side sobre ese arreglo completo en cada ciclo de
 * detección de cambios. Con 180 tarjetas (`app-gap-evaluation-item`, con su propio formulario
 * reactivo cada una) renderizadas de una, esto se sentía como un scroll "infinito" real.
 *
 * Ahora: GET /api/gap/resumen trae solo los números globales (header, mapa por tema, leyenda)
 * — no dependen de la búsqueda/filtro/página actual, así que se piden una sola vez (y de nuevo
 * tras cada guardado). GET /api/gap/items pagina de verdad (skip/pageSize) y ya filtra por
 * búsqueda/tema server-side; acá solo se acumulan las páginas ya pedidas (`pageItems`) y un
 * IntersectionObserver sobre un sentinel al final de la lista pide la siguiente cuando el
 * usuario se acerca (ver el setter de scrollSentinelRef). El DOM crece mientras se baja (append-only, no hay
 * reciclado de nodos) — las tarjetas son de altura variable (se expanden para mostrar
 * evidencia), así que un virtual-scroll con reciclado habría exigido rediseñarlas.
 *
 * app-gap-evaluation-item no se tocó: sigue esperando un RequirementEvaluation/ControlEvaluation
 * "real" (con su requirement/control anidado) porque guarda mandando ese objeto completo a
 * /api/requirementEvaluation o /api/controlEvaluation (fuera del alcance de esta paginación).
 * toGapItem() arma ese mismo shape a partir del DTO plano que ahora devuelve /api/gap/items.
 */
@Component({
  selector: 'app-gap-home',
  templateUrl: './gap-home.component.html',
  styleUrls: ['./gap-home.component.scss']
})
export class GapHomeComponent implements OnInit, OnDestroy {

  loading = true;
  evaluation: Evaluation = new Evaluation();
  standardId: number;
  evaluationId: number;

  maturityLevels: MaturityLevel[] = [];
  responsibles: Responsible[] = [];
  // Se completa en loadResumen() con 'Cláusulas' + los nombres reales de MAE_CONTROL_GROUP.
  temas: string[] = ['Todos'];
  temaRows: ThemeRow[] = [];
  stats = { pct: 0, evaluados: 0, total: 0 };
  totalEvidencias = 0;
  private legendCounts: { [name: string]: number } = {};

  pageItems: GapItem[] = [];
  hasMore = true;
  loadingMore = false;
  private skip = 0;
  private readonly pageSize = PAGE_SIZE;

  private _searchText = '';
  private _filtroTema = 'Todos';
  private filterChange$ = new Subject<void>();

  contentHeader: object;

  // Setter (no una propiedad simple): el div #scrollSentinel vive dentro de
  // *ngIf="!loading" en el template, así que todavía NO existe en el DOM
  // cuando Angular corre ngAfterViewInit() (loading sigue en true en ese
  // momento — los GET de loadResumen()/loadItems() son async y ninguno
  // volvió aún). Con una propiedad @ViewChild normal, ngAfterViewInit()
  // encontraba scrollSentinelRef undefined, el observer nunca se llegaba a
  // enganchar, y como ngAfterViewInit() solo corre una vez, jamás se
  // reintentaba: el scroll infinito quedaba "roto en silencio" (sin error,
  // simplemente nunca pedía la página siguiente). El setter sí se dispara
  // cada vez que Angular actualiza esta referencia — incluida la primera
  // vez que el *ngIf deja de ocultar el sentinel — así que engancha el
  // observer apenas el elemento existe de verdad.
  @ViewChild('scrollSentinel') set scrollSentinelRef(el: ElementRef<HTMLDivElement>) {
    if (!el || this.intersectionObserver) return;
    // rootMargin: '400px' — pide la siguiente página ANTES de que el sentinel sea visible
    // (mientras aún quedan ~400px de scroll), para que no se note un salto al llegar al final.
    this.intersectionObserver = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) this.loadItems(false);
    }, { root: null, rootMargin: '400px' });
    this.intersectionObserver.observe(el.nativeElement);
  }
  private intersectionObserver: IntersectionObserver;

  constructor(
    private _gapService: GapService,
  ) { }

  ngOnInit(): void {
    this.initContentHeader();
    // Sin distinctUntilChanged(): filterChange$ es Subject<void> (no lleva el valor de
    // searchText/filtroTema, solo avisa "algo cambió"), así que cada emisión es "undefined"
    // — distinctUntilChanged() las trataba TODAS como iguales a la anterior después de la
    // primera, y las descartaba en silencio. Resultado: el primer cambio de filtro/búsqueda
    // del componente disparaba loadItems(true), pero cualquier cambio posterior (otro chip,
    // otra tecla) quedaba sin efecto — los chips se veían "seleccionados" (leen filtroTema
    // directo) pero la lista nunca se volvía a pedir.
    this.filterChange$.pipe(debounceTime(300)).subscribe(() => this.loadItems(true));
    this.load();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  private initContentHeader() {
    this.contentHeader = {
      headerTitle: 'Análisis del GAP',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'GAP', isLink: false, link: '#' },
          { name: 'Análisis del GAP', isLink: false },
        ]
      }
    };
  }

  get searchText(): string {
    return this._searchText;
  }
  set searchText(value: string) {
    this._searchText = value;
    this.filterChange$.next();
  }

  get filtroTema(): string {
    return this._filtroTema;
  }
  set filtroTema(value: string) {
    this._filtroTema = value;
    this.filterChange$.next();
  }

  load() {
    this.loading = true;
    this.loadResumen();
    this.loadItems(true);
  }

  private loadResumen() {
    // scopeToUser=false: "Análisis del GAP" es una vista general de toda la evaluación (mapa
    // de brecha por tema, buscador sin acotar), no una lista personal — con el default
    // (scopeToUser=true) el backend solo trae ítems de grupos de control asignados al usuario
    // logueado (MAE_USER_CONTROL_GROUP), y para cualquier usuario sin esa asignación explícita
    // (ej. roles administrativos/de seguridad) la pantalla queda vacía aunque la evaluación sí
    // tenga ítems reales.
    this._gapService.getResumen(false).subscribe((res: any) => {
      this.evaluation = res.evaluation;
      this.standardId = res.evaluation?.standardId;
      this.evaluationId = res.evaluation?.evaluationId;
      this.maturityLevels = res.maturityLevels || [];
      this.responsibles = res.responsibles || [];
      this.temas = res.temas || ['Todos'];
      this.temaRows = res.temaRows || [];
      this.stats = res.stats || { pct: 0, evaluados: 0, total: 0 };
      this.totalEvidencias = res.evidencias || 0;
      this.legendCounts = {};
      for (const seg of (res.legend || [])) this.legendCounts[seg.name] = seg.count;
      this.loading = false;
    }, error => {
      this.loading = false;
      ErrorManager.handleError(error);
    });
  }

  // reset=true: búsqueda/filtro de tema cambiaron (o carga inicial) — descarta lo cargado y
  // vuelve a pedir desde el principio. reset=false: el sentinel entró en viewport, pide la
  // página siguiente y la agrega al final.
  loadItems(reset: boolean) {
    if (reset) {
      this.skip = 0;
      this.pageItems = [];
      this.hasMore = true;
    }
    if (!this.hasMore || this.loadingMore) return;

    this.loadingMore = true;
    this._gapService.getItems(this.skip, this.pageSize, this.searchText, this.filtroTema, false).subscribe((res: any) => {
      const data = res.data || [];
      const nuevos = data.map((dto: any) => this.toGapItem(dto));
      this.pageItems = reset ? nuevos : [...this.pageItems, ...nuevos];
      this.skip += data.length;
      const total = res.pagination?.totalRows ?? this.pageItems.length;
      this.hasMore = this.pageItems.length < total;
      this.loadingMore = false;
    }, error => {
      this.loadingMore = false;
      ErrorManager.handleError(error);
    });
  }

  // Arma el mismo shape que antes producían flattenRequirements/flattenControls (un
  // RequirementEvaluation/ControlEvaluation "real", con su requirement/control anidado) a
  // partir del DTO plano de /api/gap/items — así app-gap-evaluation-item no necesita cambios:
  // sigue leyendo evaluacion.requirement/control.numerationToShow/name y guardando el objeto
  // completo contra /api/requirementEvaluation o /api/controlEvaluation como ya hacía.
  private toGapItem(dto: any): GapItem {
    const responsible: Responsible | undefined = dto.responsibleId
      ? { ...new Responsible(), responsibleId: dto.responsibleId, name: this.responsibles.find(r => r.responsibleId === dto.responsibleId)?.name }
      : undefined;

    if (dto.tipo === 'control') {
      const control = new Control();
      control.controlId = dto.itemId;
      control.name = dto.name;
      control.numerationToShow = dto.code;

      const evaluacion = new ControlEvaluation();
      evaluacion.controlEvaluationId = dto.evaluationItemId || 0;
      evaluacion.evaluationId = this.evaluationId;
      evaluacion.controlId = dto.itemId;
      evaluacion.standardId = this.standardId;
      evaluacion.maturityLevelId = dto.maturityLevelId || 0;
      evaluacion.value = dto.value;
      evaluacion.responsibleId = dto.responsibleId || 0;
      evaluacion.justification = dto.justification;
      evaluacion.improvementActions = dto.improvementActions;
      evaluacion.control = control;
      evaluacion.responsible = responsible;
      return { tipo: 'control', theme: dto.theme, evaluacion };
    }

    const requirement = new Requirement();
    requirement.requirementId = dto.itemId;
    requirement.name = dto.name;
    requirement.numerationToShow = dto.code;

    const evaluacion = new RequirementEvaluation();
    evaluacion.requirementEvaluationId = dto.evaluationItemId || 0;
    evaluacion.evaluationId = this.evaluationId;
    evaluacion.requirementId = dto.itemId;
    evaluacion.standardId = this.standardId;
    evaluacion.maturityLevelId = dto.maturityLevelId || 0;
    evaluacion.value = dto.value;
    evaluacion.responsibleId = dto.responsibleId || 0;
    evaluacion.justification = dto.justification;
    evaluacion.improvementActions = dto.improvementActions;
    evaluacion.requirement = requirement;
    evaluacion.responsible = responsible;
    return { tipo: 'requisito', theme: dto.theme, evaluacion };
  }

  trackByItem(_index: number, item: GapItem): string {
    return item.tipo + '-' + ((item.evaluacion as any).requirement?.requirementId ?? (item.evaluacion as any).control?.controlId);
  }

  countEstado(name: string): number {
    return this.legendCounts[name] || 0;
  }

  pctClass(): string {
    if (this.stats.pct >= 70) return 'gap-home__pct--good';
    if (this.stats.pct >= 40) return 'gap-home__pct--warn';
    return 'gap-home__pct--bad';
  }

  onUpdate() {
    // Un ítem se guardó: los contadores globales (header, mapa por tema) pudieron cambiar.
    // La página actualmente cargada se vuelve a pedir para reflejar el nuevo estado del ítem
    // guardado — mismo comportamiento de "recargar todo" que había antes, pero ahora cuesta
    // 1 página en vez de los ~180 ítems completos.
    this.loadResumen();
    this.loadItems(true);
  }

}
