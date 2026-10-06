import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentRequirementEvaluationComponent } from './current-requirement-evaluation/current-requirement-evaluation.component';
import { CurrentControlEvaluationComponent } from './current-control-evaluation/current-control-evaluation.component';
import { HomeComponent } from './evaluation-process/resumen/home.component';
import { CurrentBreachsComponent } from './current-breachs/current-breachs.component';
import { EditBreachByEvaluationComponent } from './breach-by-evaluation/edit-breach-by-evaluation/edit-breach-by-evaluation.component';
import { EvaluationAdminComponent } from './evaluation-admin/evaluation-admin.component';
import { EvaluationProcessListComponent } from './evaluation-process-list/evaluation-process-list.component';
import { ActionPlanProgressComponent } from './evaluation-process/action-plan-progress/action-plan-progress.component';
import { ComplianceEvolutionComponent } from './evaluation-process/compliance-evolution/compliance-evolution.component';
import { BreachSeverityReportComponent } from './evaluation-process/breach-severity-report/breach-severity-report.component';
import { GapPanelComponent } from './gap-panel/gap-panel.component';
import { MyActionPlansComponent } from './my-action-plans/my-action-plans.component';
import { GapHomeComponent } from './gap-home/gap-home.component';
import { ActionPlanCalendarComponent } from './action-plan-calendar/action-plan-calendar.component';
import { PlanDeAccionComponent } from './plan-de-accion/plan-de-accion.component';
import { SoaReportComponent } from './soa-report/soa-report.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { MaturityRadarComponent } from './evaluation-process/maturity-radar/maturity-radar.component';
import { DashboardOnpeComponent } from './dashboard-onpe/dashboard-onpe.component';

const routes: Routes = [
    // Destino real de la redirección por rol GAP (login.service.ts → redirectByRole()).
    { path: 'gap-home', component: GapHomeComponent, },
    { path: 'plan-de-accion-calendario', component: ActionPlanCalendarComponent, },
    { path: 'inicio', component: HomeDashboardComponent, },
    { path: 'plan-de-accion', component: PlanDeAccionComponent, },
    { path: 'soa-report', component: SoaReportComponent, },
    { path: 'dashboard-onpe', component: DashboardOnpeComponent, },
    { path: 'panel', component: GapPanelComponent, },
    { path: 'my-action-plans', component: MyActionPlansComponent, },
    { path: 'requirement-evaluation', component: CurrentRequirementEvaluationComponent, },
    { path: 'control-evaluation', component: CurrentControlEvaluationComponent, },
    { path: 'current-breaches', component: CurrentBreachsComponent, },
    { path: 'resume', component: HomeComponent, },
    { path: 'edit-breach/:breachId/:standardId', component: EditBreachByEvaluationComponent },
    {
        path: 'evaluation-admin',
        component: EvaluationAdminComponent,
        data: { animation: 'evaluation-admin' }
    },
    // Variante con norma explícita en la ruta: filtra la lista a esa norma desde el
    // arranque (además, la pantalla igual deja elegir/cambiar la norma con un selector).
    // Sin standardId (arriba) sigue trayendo todas las normas mezcladas, como antes.
    {
        path: 'evaluation-admin/:standardId',
        component: EvaluationAdminComponent,
        data: { animation: 'evaluation-admin' }
    },
    {
        path: 'evaluation-process-list',
        component: EvaluationProcessListComponent,
        data: { animation: 'evaluation-process-list' }
    },
    { path: 'action-plan-progress', component: ActionPlanProgressComponent },
    { path: 'compliance-evolution', component: ComplianceEvolutionComponent },
    { path: 'maturity-radar', component: MaturityRadarComponent },
    { path: 'breach-severity-report', component: BreachSeverityReportComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class GapRoutingModule { }