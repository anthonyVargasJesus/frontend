import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { EditDocumentTypeComponent } from './document-type/edit-document-type/edit-document-type.component';
import { ControlTypeComponent } from './control-type/control-type.component';
import { ActionPlanStatusComponent } from './action-plan-status/action-plan-status.component';
import { ActionPlanPriorityComponent } from './action-plan-priority/action-plan-priority.component';

const routes: Routes = [
    { path: 'user', component: UserComponent, },
    { path: 'add-user', component: AddUserComponent, },
    { path: 'edit-user/:id', component: EditUserComponent, },
    { path: 'document-type', component: DocumentTypeComponent, },
    { path: 'edit-document-type/:id', component: EditDocumentTypeComponent, },
    { path: 'control-type', component: ControlTypeComponent, },
    { path: 'action-plan-status', component: ActionPlanStatusComponent, },
    { path: 'action-plan-priority', component: ActionPlanPriorityComponent, },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class SampleRoutingModule { }