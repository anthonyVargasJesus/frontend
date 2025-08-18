import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentRequirementEvaluationComponent } from './current-requirement-evaluation/current-requirement-evaluation.component';
import { CurrentControlEvaluationComponent } from './current-control-evaluation/current-control-evaluation.component';


const routes: Routes = [
    { path: 'requirement-evaluation', component: CurrentRequirementEvaluationComponent, },
    { path: 'control-evaluation', component: CurrentControlEvaluationComponent, },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class GapRoutingModule { }