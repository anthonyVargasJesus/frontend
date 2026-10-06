import { Component, OnInit } from '@angular/core';
import { GapService } from 'app/services/gap.service';
import { ActionPlanService } from 'app/services/action-plan.service';
import { Evaluation } from 'app/models/evaluation';
import { Breach } from 'app/models/breach';
import { MaturityLevel } from 'app/models/maturity-level';
import { ActionPlanStatus } from 'app/models/action-plan-status';
import { ActionPlanPriority } from 'app/models/action-plan-priority';
import { User } from 'app/models/user';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlanCounts } from '../gap-action-plan-list/gap-action-plan-list.component';

// "Alcance" liviano de ítems que trae GET /api/gap/plan-de-accion: solo lo necesario
// (tipo/itemId/maturityLevelId/theme/evaluationItemId) para resolver el estado y el tema de cada
// brecha, y para pedirle evidencia a app-gap-evidence-list, sin traer el árbol completo de
// requisitos/controles (eso lo resuelve /gap/evaluacion, no acá).
interface GapScopeItem {
  tipo: 'requisito' | 'control';
  itemId: number;
  maturityLevelId: number | null;
  theme: string;
  evaluationItemId: number;
}

interface ResolvedBreach {
  breach: Breach;
  item: GapScopeItem;
  estado: string;
  colorHex: string;
  theme: string;
}

// 'todas' o el nombre exacto de un nivel de madurez que genera brecha (MaturityLevel.name) --
// ya no una lista fija de 2 nombres: el catálogo de niveles define cuántos chips hay y cuáles.
type EstadoFilter = string;
type SortOption = 'numeracion' | 'estado';

type Row =
  | { kind: 'theme'; theme: string; count: number }
  | { kind: 'breach'; resolved: ResolvedBreach };

/**
 * "Plan de acción" — misma pantalla que la app móvil (Flutter PlanDeAccionPage): resumen de
 * acciones completadas, filtro por estado (Todas/No cumple/Parcial), orden (Numeración/Estado),
 * agrupar por tema, y una tarjeta expandible por brecha con sus acciones. Carga todo con un
 * solo GET /api/gap/plan-de-accion (GapService) + GET /api/actionPlan/countsByBreach
 * (ActionPlanService) para el resumen — los mismos dos endpoints que usa Flutter. Las acciones
 * de cada brecha (alta/edición/borrado) las resuelve app-gap-action-plan-list, ya existente,
 * sin tocarla.
 */
@Component({
  selector: 'app-plan-de-accion',
  templateUrl: './plan-de-accion.component.html',
  styleUrls: ['./plan-de-accion.component.scss']
})
export class PlanDeAccionComponent implements OnInit {

  loading = true;
  errorMessage = '';
  contentHeader: object;

  evaluation: Evaluation = new Evaluation();
  standardId: number;
  evaluationId: number;

  items: GapScopeItem[] = [];
  maturityLevels: MaturityLevel[] = [];
  breaches: Breach[] = [];
  actionPlanStatuses: ActionPlanStatus[] = [];
  actionPlanPriorities: ActionPlanPriority[] = [];
  users: User[] = [];

  filtroEstado: EstadoFilter = 'todas';
  sortOption: SortOption = 'numeracion';
  groupByTheme = false;

  // "visited" queda montado (ngIf) una vez que la brecha se expandió la primera vez, para no
  // repetir el GET de acciones al colapsar/volver a expandir — "expanded" solo controla si se
  // ve o no. Mismo criterio que Visibility(maintainState:true) en la app móvil.
  private expanded = new Set<number>();
  private visited = new Set<number>();
  private countsByBreach = new Map<number, ActionPlanCounts>();

  constructor(
    private _gapService: GapService,
    private _actionPlanService: ActionPlanService,
  ) { }

  ngOnInit(): void {
    this.initContentHeader();
    this.load();
  }

  private initContentHeader() {
    this.contentHeader = {
      headerTitle: 'Plan de acción',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Evaluación', isLink: false, link: '#' },
          { name: 'Plan de acción', isLink: false },
        ]
      }
    };
  }

  load() {
    this.loading = true;
    this.errorMessage = '';
    this._gapService.getPlanDeAccionBootstrap(true).subscribe((res: any) => {
      this.evaluation = res.evaluation;
      this.standardId = res.evaluation?.standardId;
      this.evaluationId = res.evaluation?.evaluationId;
      this.items = res.items || [];
      this.maturityLevels = res.maturityLevels || [];
      this.breaches = res.breaches || [];
      this.actionPlanStatuses = res.actionPlanStatuses || [];
      this.actionPlanPriorities = res.actionPlanPriorities || [];
      this.users = res.users || [];
      this.loading = false;
      this.loadCounts();
      this.loadHeaderStats();
    }, error => {
      this.loading = false;
      this.errorMessage = 'No se pudo cargar el plan de acción. Intenta de nuevo.';
      ErrorManager.handleError(error);
    });
  }

  // El header (app-gap-breach-map) debe mostrar el mismo % que "Cumplimiento" -- toda la
  // evaluación, no solo lo asignado a este usuario -- para que identifique la evaluación con el
  // mismo número en cualquier pantalla. "items"/"breaches" de arriba SÍ siguen acotados al
  // usuario a propósito (son los que arma el resto de la pantalla), por eso esto es una llamada
  // aparte a /api/gap/resumen con scopeToUser=false, el mismo endpoint que usa Cumplimiento.
  headerStats: { pct: number; evaluados: number; total: number } = { pct: 0, evaluados: 0, total: 0 };
  headerEvidencias = 0;

  private loadHeaderStats() {
    this._gapService.getResumen(false).subscribe((res: any) => {
      this.headerStats = res.stats || { pct: 0, evaluados: 0, total: 0 };
      this.headerEvidencias = res.evidencias || 0;
    }, error => ErrorManager.handleError(error));
  }

  // Conteo agregado de entrada (bulk); cada tarjeta de brecha lo reemplaza con el conteo real
  // al expandirse/guardar (onActionPlanCounts) sin pedirlo de nuevo acá.
  private loadCounts() {
    if (!this.evaluationId) return;
    this._actionPlanService.getCountsByBreach(this.evaluationId).subscribe((res: any) => {
      const counts = res.counts || [];
      for (const c of counts)
        this.countsByBreach.set(c.breachId, { total: c.total, completed: c.completed });
    }, error => ErrorManager.handleError(error));
  }

  // Enlaza cada brecha con su ítem (mismo tipo + id) para derivar estado y tema — una brecha
  // sin ítem correspondiente en el alcance del usuario (scopeToUser) queda fuera, igual que
  // resolveVisibleBreaches() en la app móvil.
  private get resolved(): ResolvedBreach[] {
    return this.breaches
      .map(breach => {
        const item = this.items.find(i => breach.type === '1'
          ? i.tipo === 'requisito' && i.itemId === breach.requirementId
          : i.tipo === 'control' && i.itemId === breach.controlId);
        if (!item) return null;
        const estado = this.estadoDe(item.maturityLevelId);
        const colorHex = this.maturityLevels.find(m => m.name === estado)?.color || '#6B7480';
        return { breach, item, estado, colorHex, theme: item.theme } as ResolvedBreach;
      })
      .filter((r): r is ResolvedBreach => r !== null);
  }

  private estadoDe(maturityLevelId: number | null): string {
    if (!maturityLevelId) return 'Pendiente';
    return this.maturityLevels.find(m => m.maturityLevelId === maturityLevelId)?.name || 'Pendiente';
  }

  private filterByEstado(list: ResolvedBreach[], filter: EstadoFilter): ResolvedBreach[] {
    if (filter === 'todas') return list;
    return list.filter(r => r.estado === filter);
  }

  // Un chip "Todas" + un chip por cada nivel de madurez que genera brecha (MaturityLevel.
  // generatesBreach) -- reemplaza los 2 chips fijos "No cumple"/"Parcial" de la escala vieja.
  // Ordenados por valor ascendente (el nivel más grave primero, mismo criterio que sortResolved).
  get breachGeneratingLevels(): MaturityLevel[] {
    return this.maturityLevels
      .filter(m => m.generatesBreach)
      .sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
  }

  // Cada chip cuenta sobre la lista completa, no sobre el filtro activo — así "Todas (23)"
  // no cambia cuando estás filtrando por otro estado.
  get todasCount(): number {
    return this.resolved.length;
  }

  countForEstado(estado: string): number {
    return this.filterByEstado(this.resolved, estado).length;
  }

  private compareByNumeracion(a: string, b: string): number {
    const pa = (a || '').split('.').map(n => parseInt(n, 10) || 0);
    const pb = (b || '').split('.').map(n => parseInt(n, 10) || 0);
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
      const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
      if (diff !== 0) return diff;
    }
    return 0;
  }

  // Prioridad = valor del nivel de madurez (más bajo = más grave = va primero) -- ya no un mapa
  // fijo de 2 nombres. Un estado sin nivel resuelto (no debería pasar) queda al final.
  private priorityValue(estado: string): number {
    return this.maturityLevels.find(m => m.name === estado)?.value ?? Number.MAX_SAFE_INTEGER;
  }

  private sortResolved(list: ResolvedBreach[]): ResolvedBreach[] {
    const sorted = [...list];
    if (this.sortOption === 'estado') {
      sorted.sort((a, b) => {
        const diff = this.priorityValue(a.estado) - this.priorityValue(b.estado);
        return diff !== 0 ? diff : this.compareByNumeracion(a.breach.numerationToShow, b.breach.numerationToShow);
      });
    } else {
      sorted.sort((a, b) => this.compareByNumeracion(a.breach.numerationToShow, b.breach.numerationToShow));
    }
    return sorted;
  }

  // Orden de aparición de los temas tal cual vienen en "items" (Cláusulas primero, luego cada
  // grupo de control en el orden real de MAE_CONTROL_GROUP) — no alfabético.
  private get themeOrder(): string[] {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const item of this.items) {
      if (!seen.has(item.theme)) {
        seen.add(item.theme);
        order.push(item.theme);
      }
    }
    return order;
  }

  get rows(): Row[] {
    const sorted = this.sortResolved(this.filterByEstado(this.resolved, this.filtroEstado));

    if (!this.groupByTheme)
      return sorted.map(resolved => ({ kind: 'breach', resolved }));

    const rows: Row[] = [];
    for (const theme of this.themeOrder) {
      const enTema = sorted.filter(r => r.theme === theme);
      if (enTema.length === 0) continue;
      rows.push({ kind: 'theme', theme, count: enTema.length });
      rows.push(...enTema.map(resolved => ({ kind: 'breach', resolved } as Row)));
    }
    return rows;
  }

  // "rows" es un getter que arma objetos nuevos en cada ciclo de detección de cambios (para no
  // duplicar el filtrado/orden en otro lado). Sin trackBy, *ngFor compara por identidad de
  // objeto, ve "todo nuevo" en cada CD y destruye/recrea cada tarjeta — incluida
  // app-gap-action-plan-list ya montada, que dispara su GET de nuevo al recrearse, lo que
  // retrigger CD y la vuelve a destruir: un loop que en la práctica se ve como que el
  // acordeón "no expande". trackBy por breachId/theme le dice a Angular que es la MISMA fila
  // aunque el wrapper sea un objeto distinto, así conserva el DOM y el componente hijo.
  trackByRow(_index: number, row: Row): string {
    return row.kind === 'theme' ? 'theme:' + row.theme : 'breach:' + row.resolved.breach.breachId;
  }

  get emptyMessage(): string {
    return this.filtroEstado === 'todas'
      ? 'No hay brechas registradas para esta evaluación.'
      : 'No hay brechas con ese estado.';
  }

  isExpanded(breachId: number): boolean {
    return this.expanded.has(breachId);
  }

  isVisited(breachId: number): boolean {
    return this.visited.has(breachId);
  }

  toggleBreach(breachId: number) {
    if (this.expanded.has(breachId)) {
      this.expanded.delete(breachId);
    } else {
      this.expanded.add(breachId);
      this.visited.add(breachId);
    }
  }

  onActionPlanCounts(breachId: number, counts: ActionPlanCounts) {
    this.countsByBreach.set(breachId, counts);
  }

  // Para el badge de cada fila colapsada -- de dónde sale "¿esta brecha ya tiene acciones
  // asignadas?" sin tener que expandirla. countsByBreach ya viene completo desde loadCounts()
  // (bulk al cargar la pantalla); una brecha sin ninguna acción todavía simplemente no aparece
  // en esa respuesta, por eso el default en {0,0}.
  countsFor(breachId: number): ActionPlanCounts {
    return this.countsByBreach.get(breachId) || { total: 0, completed: 0 };
  }

  get totals(): ActionPlanCounts {
    let total = 0, completed = 0;
    this.countsByBreach.forEach(c => { total += c.total; completed += c.completed; });
    return { total, completed };
  }

  get progressPct(): number {
    return this.totals.total ? Math.round((this.totals.completed / this.totals.total) * 100) : 0;
  }

  // Color real del catálogo de niveles de madurez -- ya no un mapa fijo por nombre.
  statusChipColor(estado: string): string {
    return this.maturityLevels.find(m => m.name === estado)?.color || '#8A939B';
  }

}
