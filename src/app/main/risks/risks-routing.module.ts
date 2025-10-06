import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RisksIdentificationComponent } from './risks-identification/risks-identification.component';
import { CurrentRiskEvaluationComponent } from './current-risk-evaluation/current-risk-evaluation.component';
import { RiskByEvaluationComponent } from './risk-by-evaluation/risk-by-evaluation.component';
import { AddRiskByEvaluationComponent } from './risk-by-evaluation/add-risk-by-evaluation/add-risk-by-evaluation.component';
import { EditRiskByEvaluationComponent } from './risk-by-evaluation/edit-risk-by-evaluation/edit-risk-by-evaluation.component';

const routes: Routes = [
    { path: 'identification', component: RisksIdentificationComponent, },
    { path: 'current-risks', component: CurrentRiskEvaluationComponent,},
    { path: 'risk', component: RiskByEvaluationComponent,},
    { path: 'add-risk/:id', component: AddRiskByEvaluationComponent,},
    { path: 'edit-risk/:id', component: EditRiskByEvaluationComponent,},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class RisksRoutingModule { }