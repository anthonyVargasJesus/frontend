import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardComponent } from './standard/standard.component';
import { EditStandardComponent } from './standard/edit-standard/edit-standard.component';
import { ResponsibleComponent } from './responsible/responsible.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { EditDocumentationComponent } from './documentation/edit-documentation/edit-documentation.component';
import { RequirementComponent } from './requirement/requirement.component';
import { ControlGroupComponent } from './control-group/control-group.component';
import { PolicyByStandardComponent } from './policy-by-standard/policy-by-standard.component';
import { ScopeByStandardComponent } from './scope-by-standard/scope-by-standard.component';
import { HomeStandardComponent } from './home-standard/home-standard.component';
import { DefaultRisk } from 'app/models/default-risk';
import { DefaultRiskComponent } from './default-risk/default-risk.component';


const routes: Routes = [
    { path: 'standard', component: StandardComponent, },
    { path: 'edit-standard/:id/:id2', component: EditStandardComponent, },
    { path: 'responsible/:id', component: ResponsibleComponent, },
    { path: 'documentation/:id', component: DocumentationComponent, },
    { path: 'edit-documentation/:id', component: EditDocumentationComponent, },
    { path: 'requirement/:id', component: RequirementComponent, },
    { path: 'control-group/:id', component: ControlGroupComponent, },
    { path: 'policy/:id', component: PolicyByStandardComponent, },
    { path: 'scope/:id', component: ScopeByStandardComponent, },
    { path: 'default-risk/:id', component: DefaultRiskComponent, },
    { path: 'home', component: HomeStandardComponent, },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class CurrentStandardRoutingModule { }