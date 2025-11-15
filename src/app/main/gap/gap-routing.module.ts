import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentRequirementEvaluationComponent } from './current-requirement-evaluation/current-requirement-evaluation.component';
import { CurrentControlEvaluationComponent } from './current-control-evaluation/current-control-evaluation.component';
import { HomeComponent } from './evaluation-process/resumen/home.component';
import { CurrentBreachsComponent } from './current-breachs/current-breachs.component';
import { EditBreachByEvaluationComponent } from './breach-by-evaluation/edit-breach-by-evaluation/edit-breach-by-evaluation.component';
import { EvaluationAdminComponent } from './evaluation-admin/evaluation-admin.component';
import { EvaluationProcessListComponent } from './evaluation-process-list/evaluation-process-list.component';

const routes: Routes = [
    { path: 'requirement-evaluation', component: CurrentRequirementEvaluationComponent, },
    { path: 'control-evaluation', component: CurrentControlEvaluationComponent, },
    { path: 'current-breachs', component: CurrentBreachsComponent, },
    { path: 'resume', component: HomeComponent, },
    { path: 'edit-breach/:breachId/:standardId', component: EditBreachByEvaluationComponent },
    {
        path: 'evaluation-admin',
        component: EvaluationAdminComponent,
        data: { animation: 'evaluation-admin' }
    },
    {
        path: 'evaluation-process-list',
        component: EvaluationProcessListComponent,
        data: { animation: 'evaluation-process-list' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class GapRoutingModule { }