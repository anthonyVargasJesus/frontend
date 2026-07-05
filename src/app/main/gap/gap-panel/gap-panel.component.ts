import { Component, OnInit } from '@angular/core';
import { EvaluationService } from 'app/services/evaluation.service';
import { RequirementEvaluationService } from 'app/services/requirement-evaluation.service';
import { ControlEvaluationService } from 'app/services/control-evaluation.service';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { ResponsibleService } from 'app/services/responsible.service';
import { BreachService } from 'app/services/breach.service';
import { ActionPlanStatusService } from 'app/services/action-plan-status.service';
import { ActionPlanPriorityService } from 'app/services/action-plan-priority.service';
import { UserService } from 'app/services/user.service';
import { Evaluation } from 'app/models/evaluation';
import { Requirement } from 'app/models/requirement';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { ControlEvaluation } from 'app/models/control-evaluation';
import { MaturityLevel } from 'app/models/maturity-level';
import { Responsible } from 'app/models/responsible';
import { Breach } from 'app/models/breach';
import { ActionPlanStatus } from 'app/models/action-plan-status';
import { ActionPlanPriority } from 'app/models/action-plan-priority';
import { User } from 'app/models/user';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlanCounts } from '../gap-action-plan-list/gap-action-plan-list.component';

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

const THEME_REQUISITOS = 'Cláusulas';

/**
 * Panel unificado de evaluación (requisitos + controles) con el diseño del prototipo de Fable:
 * header con % estimado, pestañas Evaluación/Plan de acción, mapa de brecha por tema, buscador
 * y filtro por tema. No inventa datos ni estados nuevos — reutiliza los mismos endpoints y
 * catálogos que ya usan requirement-evaluation/control-evaluation (RequirementEvaluationService,
 * ControlEvaluationService, MaturityLevelService, ResponsibleService, BreachService) y el
 * componente app-gap-evaluation-item para cada fila. El estado por ítem se deriva del NOMBRE
 * real del nivel de madurez asignado (Cumple/Parcial/No cumple/No aplica, tal cual están en tu
 * tabla MaturityLevel) y los temas de control se toman de MAE_CONTROL_GROUP.name — nada de esto
 * viene hardcodeado.
 */
@Component({
  selector: 'app-gap-panel',
  templateUrl: './gap-panel.component.html',
  styleUrls: ['./gap-panel.component.scss']
})
export class GapPanelComponent implements OnInit {

  loading = true;
  evaluation: Evaluation = new Evaluation();
  standardId: number;
  evaluationId: number;

  items: GapItem[] = [];
  maturityLevels: MaturityLevel[] = [];
  responsibles: Responsible[] = [];
  breaches: Breach[] = [];
  actionPlanStatuses: ActionPlanStatus[] = [];
  actionPlanPriorities: ActionPlanPriority[] = [];
  users: User[] = [];

  vista: 'evaluacion' | 'plan' = 'evaluacion';
  searchText = '';
  filtroTema = 'Todos';
  // Se completa en loadAll() con 'Cláusulas' + los nombres reales de MAE_CONTROL_GROUP.
  temas: string[] = ['Todos'];

  // Cada app-gap-action-plan-list (una por brecha visible) reporta sus propios conteos acá, para
  // armar el resumen global "X/Y acciones completadas" sin pedirle un endpoint nuevo al backend.
  private actionPlanCountsByBreach = new Map<number, ActionPlanCounts>();

  constructor(
    private _evaluationService: EvaluationService,
    private _requirementEvaluationService: RequirementEvaluationService,
    private _controlEvaluationService: ControlEvaluationService,
    private _maturityLevelService: MaturityLevelService,
    private _responsibleService: ResponsibleService,
    private _breachService: BreachService,
    private _actionPlanStatusService: ActionPlanStatusService,
    private _actionPlanPriorityService: ActionPlanPriorityService,
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this._evaluationService.getCurrent().subscribe((res: any) => {
      this.evaluation = res.data;
      this.standardId = this.evaluation.standardId;
      this.evaluationId = this.evaluation.evaluationId;
      this.loadAll();
    }, error => {
      this.loading = false;
      ErrorManager.handleError(error);
    });
  }

  private loadAll() {
    this._maturityLevelService.getAll().subscribe((res: any) => {
      this.maturityLevels = res.data;
    }, error => ErrorManager.handleError(error));

    this._responsibleService.getAll(this.standardId).subscribe((res: any) => {
      this.responsibles = res.data;
    }, error => ErrorManager.handleError(error));

    this._requirementEvaluationService.getAllByStandardIdByEvaluationId(this.standardId, this.evaluationId, '', true)
      .subscribe((res: any) => {
        const requirementItems = this.flattenRequirements(res.requirements || []);

        this._controlEvaluationService.getAllByStandardIdByEvaluationId(this.standardId, this.evaluationId, true)
          .subscribe((res2: any) => {
            const groups = res2.groups || [];
            const controlItems = this.flattenControls(groups);
            this.items = [...requirementItems, ...controlItems];
            // "Cláusulas" solo aparece como filtro si el usuario tiene alguna familia asignada
            // (requirementItems no viene vacío) — si no, no tiene sentido mostrar el chip/fila.
            this.temas = [
              'Todos',
              ...(requirementItems.length > 0 ? [THEME_REQUISITOS] : []),
              ...groups.map((g: any) => g.name),
            ];
            this.loading = false;
          }, error => {
            this.loading = false;
            ErrorManager.handleError(error);
          });
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });

    this.loadBreaches();

    this._actionPlanStatusService.getAll().subscribe((res: any) => {
      this.actionPlanStatuses = res.data || [];
    }, error => ErrorManager.handleError(error));

    this._actionPlanPriorityService.getAll().subscribe((res: any) => {
      this.actionPlanPriorities = res.data || [];
    }, error => ErrorManager.handleError(error));

    this._userService.getAll().subscribe((res: any) => {
      this.users = res.data || [];
    }, error => ErrorManager.handleError(error));
  }

  private loadBreaches() {
    this._breachService.getByevaluationId(0, 1000, this.evaluationId, '').subscribe((res: any) => {
      this.breaches = res.data || [];
    }, error => ErrorManager.handleError(error));
  }

  private flattenRequirements(requirements: Requirement[]): GapItem[] {
    let out: GapItem[] = [];
    for (const r of requirements || []) {
      if (r.requirementEvaluations?.length)
        out.push(...r.requirementEvaluations.map(evaluacion => ({ tipo: 'requisito' as const, theme: THEME_REQUISITOS, evaluacion })));
      if (r.children?.length)
        out.push(...this.flattenRequirements(r.children));
    }
    return out;
  }

  private flattenControls(groups: any[]): GapItem[] {
    let out: GapItem[] = [];
    for (const group of groups || []) {
      for (const control of group.controls || []) {
        for (const evaluacion of control.controlEvaluations || []) {
          out.push({ tipo: 'control', theme: group.name, evaluacion });
        }
      }
    }
    return out;
  }

  // Estado = nombre real del nivel de madurez asignado (Cumple/Parcial/No cumple/No aplica),
  // buscado en el catálogo completo (this.maturityLevels) por id — el maturityLevel que viene
  // embebido en la evaluación solo trae abbreviation/color/value, no el nombre.
  estadoDe(item: GapItem): string {
    const maturityLevelId = (item.evaluacion as any)?.maturityLevelId;
    if (!maturityLevelId) return 'Pendiente';
    const maturityLevel = this.maturityLevels.find(m => m.maturityLevelId === maturityLevelId);
    return maturityLevel?.name || 'Pendiente';
  }

  itemCodigo(item: GapItem): string {
    const it: any = (item.evaluacion as any).requirement || (item.evaluacion as any).control || {};
    return it.letter || it.numerationToShow || '';
  }

  itemNombre(item: GapItem): string {
    const it: any = (item.evaluacion as any).requirement || (item.evaluacion as any).control || {};
    return it.name || '';
  }

  get visibleItems(): GapItem[] {
    return this.items.filter(item => {
      if (this.filtroTema !== 'Todos' && item.theme !== this.filtroTema) return false;
      if (!this.searchText.trim()) return true;
      const q = this.searchText.toLowerCase();
      return this.itemCodigo(item).toLowerCase().includes(q) || this.itemNombre(item).toLowerCase().includes(q);
    });
  }

  get stats() {
    // "No aplica" queda fuera del % de cumplimiento (no correspondía contarlo como incumplido,
    // que es lo que hacía la regla vieja basada en value>=2).
    const evaluados = this.items.filter(i => {
      const estado = this.estadoDe(i);
      return estado !== 'Pendiente' && estado !== 'No aplica';
    });
    const cumplidos = evaluados.filter(i => this.estadoDe(i) === 'Cumple');
    const pct = evaluados.length ? Math.round((cumplidos.length / evaluados.length) * 100) : 0;
    return { pct, evaluados: evaluados.length, total: this.items.length };
  }

  get temaRows(): ThemeRow[] {
    // Un segmento de la barra por cada nivel de madurez real de tu catálogo (ordenados de mejor
    // a peor por su "value"), más "Pendiente" para lo que no se ha evaluado todavía.
    const nivelesOrdenados = [...this.maturityLevels].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    return this.temas.filter(t => t !== 'Todos').map(theme => {
      const items = this.items.filter(i => i.theme === theme);
      const segments: ThemeRowSegment[] = nivelesOrdenados.map(ml => ({
        name: ml.name,
        color: ml.color,
        count: items.filter(i => this.estadoDe(i) === ml.name).length,
      }));
      const pendiente = items.filter(i => this.estadoDe(i) === 'Pendiente').length;
      const evaluados = items.length - pendiente;
      return { theme, total: items.length, evaluados, segments, pendiente };
    });
  }

  // Total de ítems (requisitos + controles, todos los temas) en un estado dado — usado por la
  // leyenda de "Mapa de brecha por tema" para mostrar "Cumple (5)", "Parcial (15)", etc.
  countEstado(name: string): number {
    return this.items.filter(i => this.estadoDe(i) === name).length;
  }

  pctClass(): string {
    if (this.stats.pct >= 70) return 'gap-panel__pct--good';
    if (this.stats.pct >= 40) return 'gap-panel__pct--warn';
    return 'gap-panel__pct--bad';
  }

  get totalEvidencias(): number {
    return this.items.filter(i => (i.evaluacion as any).referenceDocumentations?.length > 0).length;
  }

  // this.breaches viene sin filtrar (el endpoint de brechas no conoce grupos/familias
  // asignados); se filtra acá contra this.items, que ya solo trae lo que el usuario puede ver.
  get visibleBreaches(): Breach[] {
    const requirementIds = new Set(
      this.items.filter(i => i.tipo === 'requisito').map(i => (i.evaluacion as any)?.requirement?.requirementId)
    );
    const controlIds = new Set(
      this.items.filter(i => i.tipo === 'control').map(i => (i.evaluacion as any)?.control?.controlId)
    );
    return this.breaches.filter(b => b.type === '1' ? requirementIds.has(b.requirementId) : controlIds.has(b.controlId));
  }

  // Estado real (Cumple/Parcial/No cumple/No aplica) del ítem que originó esta brecha — no
  // "breach.breachStatus" (que es el estado de gestión de la brecha en sí, abierta/cerrada).
  private itemDeBreach(breach: Breach): GapItem | undefined {
    return this.items.find(i => breach.type === '1'
      ? i.tipo === 'requisito' && (i.evaluacion as any)?.requirement?.requirementId === breach.requirementId
      : i.tipo === 'control' && (i.evaluacion as any)?.control?.controlId === breach.controlId);
  }

  estadoDeBreach(breach: Breach): string {
    const item = this.itemDeBreach(breach);
    return item ? this.estadoDe(item) : '';
  }

  colorDeEstadoBreach(breach: Breach): string {
    const nivel = this.maturityLevels.find(m => m.name === this.estadoDeBreach(breach));
    return nivel?.color || '#6B7480';
  }

  onUpdate() {
    this.loadAll();
  }

  onActionPlanCounts(breachId: number, counts: ActionPlanCounts) {
    this.actionPlanCountsByBreach.set(breachId, counts);
  }

  get actionPlanStats(): ActionPlanCounts {
    let total = 0, completed = 0;
    this.actionPlanCountsByBreach.forEach(c => { total += c.total; completed += c.completed; });
    return { total, completed };
  }

}
