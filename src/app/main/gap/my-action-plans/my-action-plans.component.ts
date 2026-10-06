import { Component, OnInit } from '@angular/core';
import { ActionPlanService } from 'app/services/action-plan.service';
import { LoginService } from 'app/services/login.service';
import { GapService } from 'app/services/gap.service';
import { Evaluation } from 'app/models/evaluation';
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

type SortOption = 'fechaLimite' | 'prioridad';

// Una fila "breach" agrupa a todas las tareas de ese control/requisito que sobrevivieron el
// filtro/orden actual -- reemplaza al viejo agrupado por vencimiento: con varias acciones para
// el mismo control, el control se repetía una vez por acción (título completo cada vez), lo que
// hacía parecer que la lista estaba duplicada en vez de mostrar acciones distintas del mismo
// control. Mismo patrón que ThemeHeaderRow en plan-de-accion.component.ts, pero agrupando por
// brecha en vez de por tema.
type Row =
  | { kind: 'breach'; breachId: number; numerationToShow: string; title: string; count: number }
  | { kind: 'task'; task: MyActionTask };

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
 * (MyActionPlansPage): filtro por estado, orden (Fecha límite/Prioridad) y agrupada siempre por
 * control/requisito (una brecha puede tener varias acciones asignadas a distintas personas, o
 * varias asignadas a vos mismo -- se listan juntas bajo el mismo encabezado en vez de repetir el
 * título del control una vez por acción), todo client-side sobre la única respuesta de carga
 * (GET /api/actionPlan/my-actions-bootstrap).
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

  contentHeader: object;

  tasks: MyActionTask[] = [];
  statuses: MyActionStatus[] = [];
  savingIds = new Set<number>();

  filtroStatusId: number | 'todas' = 'todas';
  sortOption: SortOption = 'fechaLimite';

  // Acordeón por tarea, igual que /gap/plan-de-accion (toggleBreach/isExpanded/isVisited): con
  // 3+ tareas mostrando "Mi avance" + toda la lista de evidencia siempre abierta, la pantalla se
  // hacía larguísima. "visited" evita desmontar <app-gap-evidence-list> (y perder su estado/GET)
  // cada vez que se colapsa una tarea ya vista.
  private expanded = new Set<number>();
  private visited = new Set<number>();

  // Header compartido (app-gap-breach-map) para identificar en qué evaluación estás parado --
  // mismos datos y mismo criterio que en Plan de acción: /api/gap/resumen con scopeToUser=false,
  // no calculado sobre "tasks" (que son solo tuyas, no todos los ítems de la evaluación).
  evaluation: Evaluation = new Evaluation();
  headerStats: { pct: number; evaluados: number; total: number } = { pct: 0, evaluados: 0, total: 0 };
  headerEvidencias = 0;

  constructor(
    private _actionPlanService: ActionPlanService,
    private _loginService: LoginService,
    private _gapService: GapService,
  ) { }

  ngOnInit(): void {
    this.userEmail = this._loginService.getCurrentUser()?.em || '';
    this.initContentHeader();
    this.load();
  }

  private initContentHeader() {
    this.contentHeader = {
      headerTitle: 'Mis acciones',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Evaluación', isLink: false, link: '#' },
          { name: 'Mis acciones', isLink: false },
        ]
      }
    };
  }

  load() {
    this.loading = true;
    this.errorMessage = '';
    this._actionPlanService.getMyActionsBootstrap().subscribe((res: any) => {
      this.tasks = res.tasks || [];
      this.statuses = res.statuses || [];
      this.loading = false;
      this.loadHeaderStats();
    }, error => {
      this.loading = false;
      this.errorMessage = 'No se pudieron cargar tus acciones. Intenta de nuevo.';
      ErrorManager.handleError(error);
    });
  }

  private loadHeaderStats() {
    this._gapService.getResumen(false).subscribe((res: any) => {
      this.evaluation = res.evaluation;
      this.headerStats = res.stats || { pct: 0, evaluados: 0, total: 0 };
      this.headerEvidencias = res.evidencias || 0;
    }, error => ErrorManager.handleError(error));
  }

  isSaving(actionPlanId: number): boolean {
    return this.savingIds.has(actionPlanId);
  }

  isExpanded(actionPlanId: number): boolean {
    return this.expanded.has(actionPlanId);
  }

  isVisited(actionPlanId: number): boolean {
    return this.visited.has(actionPlanId);
  }

  toggleTask(actionPlanId: number) {
    if (this.expanded.has(actionPlanId)) {
      this.expanded.delete(actionPlanId);
    } else {
      this.expanded.add(actionPlanId);
      this.visited.add(actionPlanId);
    }
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

  // El estado "más completo" del catálogo (mayor "value") se considera completado -- mismo
  // criterio que ya usa gap-action-plan-list.component.ts (maxValueStatusId/isCompleted) para
  // el contador de "Plan de acción"; acá es el mismo cálculo pero solo sobre MIS tareas.
  private get maxValueStatusId(): number | undefined {
    return [...this.statuses].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0]?.actionPlanStatusId;
  }

  isCompleted(task: MyActionTask): boolean {
    return task.actionPlanStatusId === this.maxValueStatusId;
  }

  get totals(): { total: number; completed: number } {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => this.isCompleted(t)).length;
    return { total, completed };
  }

  get progressPct(): number {
    return this.totals.total ? Math.round((this.totals.completed / this.totals.total) * 100) : 0;
  }

  // Chips de filtro por estado ("Mi avance") -- a diferencia de priorities() (que se derivaba
  // solo de las tareas), el catálogo real viene de la BD (MAE_ACTION_PLAN_STATUS, ya cargado en
  // this.statuses para los botones "Mi avance"): se reutiliza acá para no hardcodear
  // "Pendiente/En curso/Completado" en el HTML. Ordenado por "value" del catálogo (mismo
  // criterio que maxValueStatusId), no por conteo ni alfabético; solo se listan los estados que
  // tienen al menos una tarea, igual que antes hacía priorities().
  get statusFilters(): (MyActionStatus & { count: number })[] {
    return [...this.statuses]
      .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))
      .map(s => ({ ...s, count: this.tasks.filter(t => t.actionPlanStatusId === s.actionPlanStatusId).length }))
      .filter(s => s.count > 0);
  }

  private get filtered(): MyActionTask[] {
    if (this.filtroStatusId === 'todas') return this.tasks;
    return this.tasks.filter(t => t.actionPlanStatusId === this.filtroStatusId);
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

  // Días hasta el vencimiento (negativo = ya venció) -- base del badge de fecha de cada tarjeta
  // (dueLabel/isOverdue), para no calcularlo dos veces con criterios ligeramente distintos.
  private daysUntilDue(task: MyActionTask): number {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0);
    return Math.round((due.getTime() - today.getTime()) / 86400000);
  }

  // Tareas completadas no se marcan como "vencidas" aunque la fecha ya haya pasado -- ya no hay
  // nada pendiente que atrasar. Mismo criterio para el color/texto del badge de fecha.
  isOverdue(task: MyActionTask): boolean {
    return !this.isCompleted(task) && this.daysUntilDue(task) < 0;
  }

  daysOverdue(task: MyActionTask): number {
    return Math.max(0, -this.daysUntilDue(task));
  }

  isDueToday(task: MyActionTask): boolean {
    return !this.isCompleted(task) && this.daysUntilDue(task) === 0;
  }

  // Agrupa por brecha en el mismo orden en que ya salen de sortTasks() -- una brecha con varias
  // acciones (asignadas a vos o a otras personas, con distinto estado cada una) aparece como un
  // solo encabezado con sus tareas debajo, en vez de repetir el título del control una vez por
  // acción. Mismo patrón que groupResolvedByTheme() en plan-de-accion.component.ts, pero
  // agrupando por brecha (acá no hay "tema" -- todas las brechas de esta lista son del usuario).
  get rows(): Row[] {
    const sorted = this.sortTasks(this.filtered);
    const rows: Row[] = [];
    const seenBreaches = new Set<number>();
    for (const task of sorted) {
      if (!seenBreaches.has(task.breachId)) {
        seenBreaches.add(task.breachId);
        const count = sorted.filter(t => t.breachId === task.breachId).length;
        rows.push({
          kind: 'breach',
          breachId: task.breachId,
          numerationToShow: task.breachNumerationToShow,
          title: task.breachTitle,
          count,
        });
      }
      rows.push({ kind: 'task', task });
    }
    return rows;
  }

  // Sin trackBy, *ngFor recrearía cada tarjeta (y su app-gap-evidence-list ya montado) en cada
  // ciclo de detección de cambios, porque "rows" arma objetos nuevos cada vez que se evalúa —
  // mismo bug ya corregido en /gap/plan-de-accion.
  trackByRow(_index: number, row: Row): string {
    return row.kind === 'breach' ? 'breach:' + row.breachId : 'task:' + row.task.actionPlanId;
  }

  get emptyMessage(): string {
    return this.filtroStatusId === 'todas'
      ? 'No tienes acciones asignadas por ahora.'
      : 'No hay acciones con ese estado.';
  }

}
