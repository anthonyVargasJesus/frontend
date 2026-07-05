import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { ActionPlan } from 'app/models/action-plan';
import { ActionPlanStatus } from 'app/models/action-plan-status';
import { ActionPlanPriority } from 'app/models/action-plan-priority';
import { User } from 'app/models/user';
import { ActionPlanService } from 'app/services/action-plan.service';
import { ErrorManager } from 'app/errors/error-manager';

const MAX_ACTION_PLAN_ROWS = 100;

export interface ActionPlanCounts {
  total: number;
  completed: number;
}

/**
 * Lista de acciones de un plan de acción, con el diseño del prototipo de Fable: tarjetas en
 * línea editables (sin modal, sin tabla), con botón GUARDAR explícito por tarjeta (el guardado
 * automático por campo resultaba en un toast de éxito por cada click en un chip). Reemplaza a
 * app-action-plan-by-breach-id (tabla administrativa con paginación/modales) dentro de
 * /gap/panel — ese componente viejo sigue existiendo para otras pantallas que no se tocaron.
 */
@Component({
  selector: 'app-gap-action-plan-list',
  templateUrl: './gap-action-plan-list.component.html',
  styleUrls: ['./gap-action-plan-list.component.scss']
})
export class GapActionPlanListComponent implements OnInit, OnChanges {

  @Input() breachId: number | undefined;
  @Input() evaluationId: number | undefined;
  @Input() standardId: number | undefined;

  // Catálogos: se cargan una sola vez en gap-panel y se pasan a cada fila de brecha, para no
  // repetir la misma llamada HTTP por cada brecha visible.
  @Input() statusesInput: ActionPlanStatus[] = [];
  @Input() prioritiesInput: ActionPlanPriority[] = [];
  @Input() usersInput: User[] = [];

  @Output() countsChanged = new EventEmitter<ActionPlanCounts>();

  actionPlans: ActionPlan[] = [];
  loading = false;

  constructor(private _actionPlanService: ActionPlanService) { }

  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.breachId)
      this.load();
  }

  private load() {
    if (!this.breachId) return;
    this.loading = true;
    this._actionPlanService.getBybreachId(0, MAX_ACTION_PLAN_ROWS, this.breachId, '').subscribe((res: any) => {
      this.actionPlans = res.data || [];
      this.loading = false;
      this.emitCounts();
    }, error => {
      this.loading = false;
      ErrorManager.handleError(error);
    });
  }

  // El estado "más completo" del catálogo (mayor "value") se considera completado — misma
  // convención que ya usan los niveles de madurez en esta pantalla, sin adivinar abreviaturas.
  private get maxValueStatusId(): number | undefined {
    return [...this.statusesInput].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0]?.actionPlanStatusId;
  }

  isCompleted(actionPlan: ActionPlan): boolean {
    return !!actionPlan.actionPlanStatusId && actionPlan.actionPlanStatusId === this.maxValueStatusId;
  }

  private emitCounts() {
    const total = this.actionPlans.length;
    const completed = this.actionPlans.filter(ap => this.isCompleted(ap)).length;
    this.countsChanged.emit({ total, completed });
  }

  private get defaultPriorityId(): number | undefined {
    const media = this.prioritiesInput.find(p => (p.name || '').toLowerCase().includes('media'));
    return media?.actionPlanPriorityId ?? this.prioritiesInput[0]?.actionPlanPriorityId;
  }

  private get defaultStatusId(): number | undefined {
    const pendiente = this.statusesInput.find(s => (s.name || '').toLowerCase().includes('pendiente'));
    return pendiente?.actionPlanStatusId ?? this.statusesInput[0]?.actionPlanStatusId;
  }

  add() {
    const draft = new ActionPlan();
    draft.breachId = this.breachId;
    draft.evaluationId = this.evaluationId;
    draft.standardId = this.standardId;
    draft.title = '';
    // "Fecha de inicio" no se pide en este diseño compacto (el prototipo solo pide "Fecha
    // límite"); se completa sola con la fecha de hoy, que es lo que exige el backend al crear.
    draft.startDate = new Date();
    draft.actionPlanPriorityId = this.defaultPriorityId;
    draft.actionPlanStatusId = this.defaultStatusId;
    this.actionPlans.push(draft);
  }

  private hasRequiredFieldsToCreate(actionPlan: ActionPlan): boolean {
    return !!(actionPlan.title?.trim() && actionPlan.userId && actionPlan.startDate
      && actionPlan.dueDate && actionPlan.actionPlanPriorityId);
  }

  // Referencia de los que se están guardando, para deshabilitar su botón GUARDAR mientras dura
  // la llamada (comparación por referencia, igual que el patrón ya usado en delete()).
  private savingSet = new Set<ActionPlan>();

  isSaving(actionPlan: ActionPlan): boolean {
    return this.savingSet.has(actionPlan);
  }

  // Los cambios en los campos ya NO se guardan solos: el usuario edita libremente (título,
  // responsable, fecha, prioridad, estado) y recién se envía al backend al presionar GUARDAR —
  // antes cada click en un chip disparaba un update() con su propio toast de éxito, lo cual era
  // muy ruidoso para algo tan frecuente como cambiar de prioridad/estado.
  save(actionPlan: ActionPlan) {
    if (!actionPlan.actionPlanId && !this.hasRequiredFieldsToCreate(actionPlan)) {
      Swal.fire('Faltan datos', 'Completa título, responsable, fecha límite y prioridad antes de guardar.', 'warning');
      return;
    }

    this.savingSet.add(actionPlan);
    const onDone = (updated?: ActionPlan) => {
      if (updated) Object.assign(actionPlan, updated);
      this.savingSet.delete(actionPlan);
      this.emitCounts();
    };
    const onError = (error: any) => {
      this.savingSet.delete(actionPlan);
      ErrorManager.handleError(error);
    };

    if (!actionPlan.actionPlanId) {
      this._actionPlanService.insert(actionPlan).subscribe((res: any) => onDone(res.data), onError);
    } else {
      this._actionPlanService.update(actionPlan).subscribe(() => onDone(), onError);
    }
  }

  // <input type="date"> exige un string "yyyy-MM-dd", no un objeto Date — se convierte acá en
  // vez de bindear directo con ngModel, que no formatea el value nativo del input.
  dueDateStr(actionPlan: ActionPlan): string {
    if (!actionPlan.dueDate) return '';
    const date = new Date(actionPlan.dueDate);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  }

  setDueDate(actionPlan: ActionPlan, value: string) {
    actionPlan.dueDate = value ? new Date(value + 'T00:00:00') : undefined;
  }

  delete(actionPlan: ActionPlan) {
    if (!actionPlan.actionPlanId) {
      this.actionPlans = this.actionPlans.filter(ap => ap !== actionPlan);
      this.emitCounts();
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      text: `¿Está seguro de eliminar la acción "${actionPlan.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(result => {
      if (!result.isConfirmed) return;
      this._actionPlanService.delete(actionPlan.actionPlanId).subscribe(() => {
        this.actionPlans = this.actionPlans.filter(ap => ap !== actionPlan);
        this.emitCounts();
      });
    });
  }

}
