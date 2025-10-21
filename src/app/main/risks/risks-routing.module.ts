import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RisksIdentificationComponent } from './risks-identification/risks-identification.component';
import { CurrentRiskEvaluationComponent } from './current-risk-evaluation/current-risk-evaluation.component';
import { RiskByEvaluationComponent } from './risk-by-evaluation/risk-by-evaluation.component';
import { AddRiskByEvaluationComponent } from './risk-by-evaluation/add-risk-by-evaluation/add-risk-by-evaluation.component';
import { EditRiskByEvaluationComponent } from './risk-by-evaluation/edit-risk-by-evaluation/edit-risk-by-evaluation.component';
import { RiskToEvaluationComponent } from './risk-to-evaluation/risk-to-evaluation.component';
import { RiskToTreatmentComponent } from './risk-to-treatment/risk-to-treatment.component';
import { RiskToControlComponent } from './risk-to-control/risk-to-control.component';
import { ControlImplementationByRiskComponent } from './control-implementation-by-risk/control-implementation-by-risk.component';
import { MenaceTypeComponent } from './menace-type/menace-type.component';
import { MenaceComponent } from './menace/menace.component';
import { VulnerabilityTypeComponent } from './vulnerability-type/vulnerability-type.component';
import { VulnerabilityComponent } from './vulnerability/vulnerability.component';
import { RiskLevelComponent } from './risk-level/risk-level.component';
import { RiskTreatmentMethodComponent } from './risk-treatment-method/risk-treatment-method.component';
import { ResidualRiskComponent } from './residual-risk/residual-risk.component';

const routes: Routes = [
    { path: 'identification', component: RisksIdentificationComponent, },
    { path: 'current-risks', component: CurrentRiskEvaluationComponent, },
    { path: 'risk', component: RiskByEvaluationComponent, },
    { path: 'add-risk/:id', component: AddRiskByEvaluationComponent, },
    { path: 'edit-risk/:id', component: EditRiskByEvaluationComponent, },
    { path: 'risk-to-evaluation', component: RiskToEvaluationComponent, },
    { path: 'risk-to-treatment', component: RiskToTreatmentComponent, },
    { path: 'risk-to-control', component: RiskToControlComponent, },
    { path: 'control-implementation/:id', component: ControlImplementationByRiskComponent, },
    {
        path: 'menace-type',
        component: MenaceTypeComponent,
        data: { animation: 'menace-type' }
    },
    {
        path: 'menace',
        component: MenaceComponent,
        data: { animation: 'menace' }
    },
    {
        path: 'vulnerability-type',
        component: VulnerabilityTypeComponent,
        data: { animation: 'vulnerability-type' }
    },
    {
        path: 'vulnerability',
        component: VulnerabilityComponent,
        data: { animation: 'vulnerability' }
    },
    {
        path: 'risk-level',
        component: RiskLevelComponent,
        data: { animation: 'risk-level' }
    },
    {
        path: 'risk-treatment-method',
        component: RiskTreatmentMethodComponent,
        data: { animation: 'risk-treatment-method' }
    },
    {
        path: 'residual-risk',
        component: ResidualRiskComponent,
        data: { animation: 'residual-risk' }
    },
    //   },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class RisksRoutingModule { }