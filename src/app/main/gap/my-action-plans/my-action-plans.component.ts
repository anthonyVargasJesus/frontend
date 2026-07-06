import { Component, OnInit } from '@angular/core';
import { EvaluationService } from 'app/services/evaluation.service';
import { ActionPlanService } from 'app/services/action-plan.service';
import { ActionPlanStatusService } from 'app/services/action-plan-status.service';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';

/**
 * "Mis acciones": las tareas de plan de acción asignadas al usuario logeado, sin importar en
 * qué brecha/control estén — pantalla del responsable que ejecuta, distinta de /gap/panel (que
 * es la vista del dueño del control, con todos los campos editables). Acá solo se puede avanzar
 * el estado de la propia tarea ("Mi avance"); todo lo demás (título, prioridad, responsable) se
 * edita desde /gap/panel.
 */
@Component({
  selector: 'app-my-action-plans',
  templateUrl: './my-action-plans.component.html',
  styleUrls: ['./my-action-plans.component.scss']
})
export class MyActionPlansComponent implements OnInit {

  loading = true;
  userEmail = '';
  evaluationId: number;
  actionPlans: any[] = [];
  statuses: any[] = [];
  savingIds = new Set<number>();

  constructor(
    private _evaluationService: EvaluationService,
    private _actionPlanService: ActionPlanService,
    private _actionPlanStatusService: ActionPlanStatusService,
    private _loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.userEmail = this._loginService.getCurrentUser()?.em || '';
    this._evaluationService.getCurrent().subscribe((res: any) => {
      this.evaluationId = res.data.evaluationId;
      this.load();
    }, error => {
      this.loading = false;
      ErrorManager.handleError(error);
    });
    this._actionPlanStatusService.getAll().subscribe((res: any) => {
      this.statuses = res.data || [];
    }, error => ErrorManager.handleError(error));
  }

  private load() {
    this.loading = true;
    this._actionPlanService.getByUser(this.evaluationId).subscribe((res: any) => {
      this.actionPlans = res.data || [];
      this.loading = false;
    }, error => {
      this.loading = false;
      ErrorManager.handleError(error);
    });
  }

  isSaving(actionPlanId: number): boolean {
    return this.savingIds.has(actionPlanId);
  }

  // El backend resuelve requirementEvaluationId/controlEvaluationId desde la brecha (Breach solo
  // guarda requirementId/controlId) — <app-gap-evidence-list> necesita saber cuál de los dos usar.
  tipoDe(ap: any): 'requisito' | 'control' {
    return ap.requirementEvaluationId ? 'requisito' : 'control';
  }

  hasEvidenceTarget(ap: any): boolean {
    return !!(ap.requirementEvaluationId || ap.controlEvaluationId);
  }

  setStatus(ap: any, actionPlanStatusId: number) {
    if (ap.actionPlanStatusId === actionPlanStatusId) return;

    const previous = ap.actionPlanStatusId;
    ap.actionPlanStatusId = actionPlanStatusId;
    this.savingIds.add(ap.actionPlanId);

    this._actionPlanService.updateQuiet(ap).subscribe((res: any) => {
      this.savingIds.delete(ap.actionPlanId);
      const status = this.statuses.find(s => s.actionPlanStatusId === actionPlanStatusId);
      if (status) {
        ap.statusName = status.name;
        ap.statusColor = status.color;
      }
    }, error => {
      ap.actionPlanStatusId = previous;
      this.savingIds.delete(ap.actionPlanId);
      ErrorManager.handleError(error);
    });
  }

}
