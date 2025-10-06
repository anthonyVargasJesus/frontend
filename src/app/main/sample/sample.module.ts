import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { HeaderUserComponent } from './user/header-user/header-user.component';
import { SampleRoutingModule } from './sample-routing.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { RoleInUserByUserComponent } from './role-in-user-by-user/role-in-user-by-user.component';
import { AddRoleInUserByUserComponent } from './role-in-user-by-user/add-role-in-user-by-user/add-role-in-user-by-user.component';
import { EditRoleInUserByUserComponent } from './role-in-user-by-user/edit-role-in-user-by-user/edit-role-in-user-by-user.component';
import { ControlTypeComponent } from './control-type/control-type.component';
import { AddControlTypeComponent } from './control-type/add-control-type/add-control-type.component';
import { EditControlTypeComponent } from './control-type/edit-control-type/edit-control-type.component';
import { EditDocumentTypeComponent } from './document-type/edit-document-type/edit-document-type.component';
import { AddDocumentTypeComponent } from './document-type/add-document-type/add-document-type.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { ActionPlanStatusComponent } from './action-plan-status/action-plan-status.component';
import { AddActionPlanStatusComponent } from './action-plan-status/add-action-plan-status/add-action-plan-status.component';
import { EditActionPlanStatusComponent } from './action-plan-status/edit-action-plan-status/edit-action-plan-status.component';
import { ActionPlanPriorityComponent } from './action-plan-priority/action-plan-priority.component';
import { AddActionPlanPriorityComponent } from './action-plan-priority/add-action-plan-priority/add-action-plan-priority.component';
import { EditActionPlanPriorityComponent } from './action-plan-priority/edit-action-plan-priority/edit-action-plan-priority.component';


@NgModule({
  declarations: [ 
    UserComponent, AddUserComponent, EditUserComponent, HeaderUserComponent,
    RoleInUserByUserComponent, AddRoleInUserByUserComponent, EditRoleInUserByUserComponent,
    ControlTypeComponent, AddControlTypeComponent, EditControlTypeComponent,
    DocumentTypeComponent, AddDocumentTypeComponent, EditDocumentTypeComponent,
    ActionPlanStatusComponent, AddActionPlanStatusComponent, EditActionPlanStatusComponent,
    ActionPlanPriorityComponent, AddActionPlanPriorityComponent, EditActionPlanPriorityComponent
  ],
  imports: [
        CommonModule,
        NgxMaskModule.forRoot(),
        SampleRoutingModule,
        ContentHeaderModule,
        TranslateModule,
        CoreCommonModule,
        MatDialogModule,
        MatButtonModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        NgbModule,
  ]
})


export class SampleModule { }
