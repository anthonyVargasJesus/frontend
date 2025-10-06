import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentRequirementEvaluationComponent } from './current-requirement-evaluation/current-requirement-evaluation.component';
import { CurrentControlEvaluationComponent } from './current-control-evaluation/current-control-evaluation.component';
import { HomeComponent } from './evaluation-process/resumen/home.component';
import { CurrentBreachsComponent } from './current-breachs/current-breachs.component';
import { EditBreachByEvaluationComponent } from './breach-by-evaluation/edit-breach-by-evaluation/edit-breach-by-evaluation.component';

const routes: Routes = [
    { path: 'requirement-evaluation', component: CurrentRequirementEvaluationComponent, },
    { path: 'control-evaluation', component: CurrentControlEvaluationComponent, },
    { path: 'current-breachs', component: CurrentBreachsComponent, },
    { path: 'resume', component: HomeComponent, },
    { path: 'edit-breach/:breachId/:standardId' , component: EditBreachByEvaluationComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class GapRoutingModule { }