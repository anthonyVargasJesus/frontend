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


@NgModule({
  declarations: [ 
    UserComponent, AddUserComponent, EditUserComponent, HeaderUserComponent,
    RoleInUserByUserComponent, AddRoleInUserByUserComponent, EditRoleInUserByUserComponent,
    ControlTypeComponent, AddControlTypeComponent, EditControlTypeComponent,
    DocumentTypeComponent, AddDocumentTypeComponent, EditDocumentTypeComponent,
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
