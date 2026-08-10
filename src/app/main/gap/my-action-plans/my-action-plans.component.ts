import { Component, OnInit } from '@angular/core';
import { ActionPlanService } from 'app/services/action-plan.service';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';

// Forma exacta de cada tarea tal como la devuelve GET /api/actionPlan/my-actions-bootstrap
// (misma que consume la app móvil) — ya trae resueltos requirementEvaluationId/
// controlEvaluationId, nombre/color de estado y prioridad, sin necesidad de otro catálogo.
interface MyActionTask {
  actionPlanId: number;
  breachId: number;
  evaluationId: number;
  standardId: number;
  userId: number;
  breachNumerationToShow: string;
  breachTitle: string;
  title: string;
  description?: string;
  startDate: string;
  dueDate: string;
  actionPlanStatusId: number;
  statusName: string;
  statusColor: string;
  actionPlanPriorityId: number;
  priorityName: string;
  priorityColor: string;
  requirementEvaluationId?: number;
  controlEvaluationId?: number;
}

interface MyActionStatus {
  actionPlanStatusId: number;
  name: string;
  color: string;
  value: number;
}

interface Priority {
  actionPlanPriorityId: number;
  name: string;
  color: string;
  count: number;
}

type SortOption = 'fechaLimite' | 'prioridad';
type DueBucket = 'vencidas' | 'proximaSemana' | 'masAdelante';

type Row =
  | { kind: 'bucket'; bucket: DueBucket; count: number }
  | { kind: 'task'; task: MyActionTask };

const DUE_BUCKET_ORDER: DueBucket[] = ['vencidas', 'proximaSemana', 'masAdelante'];
const DUE_BUCKET_LABEL: { [k in DueBucket]: string } = {
  vencidas: 'Vencidas',
  proximaSemana: 'Vence esta semana',
  masAdelante: 'Más adelante',
};

// Prioridades no vienen de un catálogo aparte en esta pantalla (se derivan de las tareas ya
// cargadas, igual que en la app móvil) — este rank solo define el orden de los chips/orden
// "Prioridad", no colores ni nombres (esos son datos reales de cada tarea).
const PRIORITY_RANK: { [name: string]: number } = { 'alta': 0, 'media': 1, 'baja': 2 };
const PRIORITY_RANK_DEFAULT = 99;

/**
 * "Mis acciones": las tareas de plan de acción asignadas al usuario logeado, sin importar en
 * qué brecha/control estén — pantalla del responsable que ejecuta, distinta de /gap/panel (que
 * es la vista del dueño del control, con todos los campos editables). Acá solo se puede avanzar
 * el estado de la propia tarea ("Mi avance") y adjuntar evidencia; todo lo demás (título,
 * prioridad, responsable) se edita desde /gap/panel. Misma pantalla que la app móvil
 * (MyActionPlansPage): filtro por prioridad, orden (Fecha límite/Prioridad) y agrupar por
 * vencimiento (Vencidas/Vence esta semana/Más adelante), todo client-side sobre la única
 * respuesta de carga (GET /api/actionPlan/my-actions-bootstrap).
 */
@Component({
  selector: 'app-my-action-plans',
  templateUrl: './my-action-plans.component.html',
  styleUrls: ['./my-action-plans.component.scss']
})
export class MyActionPlansComponent implements OnInit {

  loading = true;
  errorMessage = '';
  userEmail = '';

  tasks: MyActionTask[] = [];
  statuses: MyActionStatus[] = [];
  savingIds = new Set<number>();

  filtroPriorityId: number | 'todas' = 'todas';
  sortOption: SortOption = 'fechaLimite';
  groupByDueDate = false;

  constructor(
    private _actionPlanService: ActionPlanService,
    private _loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.userEmail = this._loginService.getCurrentUser()?.em || '';
    this.load();
  }

  load() {
    this.loading = true;
    this.errorMessage = '';
    this._actionPlanService.getMyActionsBootstrap().subscribe((res: any) => {
      this.tasks = res.tasks || [];
      this.statuses = res.statuses || [];
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errorMessage = 'No se pudieron cargar tus acciones. Intenta de nuevo.';
      ErrorManager.handleError(error);
    });
  }

  isSaving(actionPlanId: number): boolean {
    return this.savingIds.has(actionPlanId);
  }

  // El backend resuelve requirementEvaluationId/controlEvaluationId desde la brecha (Breach solo
  // guarda requirementId/controlId) — <app-gap-evidence-list> necesita saber cuál de los dos usar.
  tipoDe(task: MyActionTask): 'requisito' | 'control' {
    return task.requirementEvaluationId ? 'requisito' : 'control';
  }

  hasEvidenceTarget(task: MyActionTask): boolean {
    return !!(task.requirementEvaluationId || task.controlEvaluationId);
  }

  // Actualización optimista: se ve el cambio al toque, y si el PUT falla se revierte — mismo
  // criterio que usa la app móvil (setStatus() en my_action_plans_notifier.dart).
  setStatus(task: MyActionTask, actionPlanStatusId: number) {
    if (task.actionPlanStatusId === actionPlanStatusId) return;

    const previous = { statusId: task.actionPlanStatusId, statusName: task.statusName, statusColor: task.statusColor };
    const status = this.statuses.find(s => s.actionPlanStatusId === actionPlanStatusId);
    task.actionPlanStatusId = actionPlanStatusId;
    if (status) {
      task.statusName = status.name;
      task.statusColor = status.color;
    }
    this.savingIds.add(task.actionPlanId);

    this._actionPlanService.updateQuiet(task as any).subscribe(() => {
      this.savingIds.delete(task.actionPlanId);
    }, error => {
      task.actionPlanStatusId = previous.statusId;
      task.statusName = previous.statusName;
      task.statusColor = previous.statusColor;
      this.savingIds.delete(task.actionPlanId);
      ErrorManager.handleError(error);
    });
  }

  // Derivadas de las tareas ya cargadas (esta pantalla no pide /api/actionPlanPriority/all
  // aparte) — mismo criterio que distinctPriorities() en la app móvil.
  get priorities(): Priority[] {
    const byId = new Map<number, Priority>();
    for (const t of this.tasks) {
      const existing = byId.get(t.actionPlanPriorityId);
      if (existing) {
        existing.count++;
      } else {
        byId.set(t.actionPlanPriorityId, {
          actionPlanPriorityId: t.actionPlanPriorityId,
          name: t.priorityName,
          color: t.priorityColor,
          count: 1,
        });
      }
    }
    return Array.from(byId.values()).sort((a, b) => {
      const rank = (p: Priority) => PRIORITY_RANK[(p.name || '').toLowerCase()] ?? PRIORITY_RANK_DEFAULT;
      const diff = rank(a) - rank(b);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
  }

  private get filtered(): MyActionTask[] {
    if (this.filtroPriorityId === 'todas') return this.tasks;
    return this.tasks.filter(t => t.actionPlanPriorityId === this.filtroPriorityId);
  }

  private sortTasks(list: MyActionTask[]): MyActionTask[] {
    const sorted = [...list];
    if (this.sortOption === 'prioridad') {
      const rank = (t: MyActionTask) => PRIORITY_RANK[(t.priorityName || '').toLowerCase()] ?? PRIORITY_RANK_DEFAULT;
      sorted.sort((a, b) => {
        const diff = rank(a) - rank(b);
        return diff !== 0 ? diff : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else {
      sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    return sorted;
  }

  // Vencidas / Vence esta semana / Más adelante — ventanas relativas a hoy, no calendario, y sin
  // "Sin fecha" (dueDate siempre viene con valor en esta pantalla). Mismo criterio que
  // dueBucketOf() en la app móvil.
  private dueBucketOf(task: MyActionTask): DueBucket {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0);
    const daysUntilDue = Math.round((due.getTime() - today.getTime()) / 86400000);
    if (daysUntilDue < 0) return 'vencidas';
    if (daysUntilDue <= 7) return 'proximaSemana';
    return 'masAdelante';
  }

  get rows(): Row[] {
    const sorted = this.sortTasks(this.filtered);

    if (!this.groupByDueDate)
      return sorted.map(task => ({ kind: 'task', task } as Row));

    const rows: Row[] = [];
    for (const bucket of DUE_BUCKET_ORDER) {
      const enBucket = sorted.filter(t => this.dueBucketOf(t) === bucket);
      if (enBucket.length === 0) continue;
      rows.push({ kind: 'bucket', bucket, count: enBucket.length });
      rows.push(...enBucket.map(task => ({ kind: 'task', task } as Row)));
    }
    return rows;
  }

  // Sin trackBy, *ngFor recrearía cada tarjeta (y su app-gap-evidence-list ya montado) en cada
  // ciclo de detección de cambios, porque "rows" arma objetos nuevos cada vez que se evalúa —
  // mismo bug ya corregido en /gap/plan-de-accion.
  trackByRow(_index: number, row: Row): string {
    return row.kind === 'bucket' ? 'bucket:' + row.bucket : 'task:' + row.task.actionPlanId;
  }

  bucketLabel(bucket: DueBucket): string {
    return DUE_BUCKET_LABEL[bucket];
  }

  get emptyMessage(): string {
    return this.filtroPriorityId === 'todas'
      ? 'No tienes acciones asignadas por ahora.'
      : 'No hay acciones con esa prioridad.';
  }

}
