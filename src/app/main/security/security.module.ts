import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityHomeComponent } from './security-home/security-home.component';
import { OptionComponent } from './option/option.component';
import { AddOptionComponent } from './option/add-option/add-option.component';
import { EditOptionComponent } from './option/edit-option/edit-option.component';
import { MenuComponent } from './menu/menu.component';
import { AddMenuComponent } from './menu/add-menu/add-menu.component';
import { EditMenuComponent } from './menu/edit-menu/edit-menu.component';
import { RoleComponent } from './role/role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { OptionInMenuByMenuComponent } from './option-in-menu-by-menu/option-in-menu-by-menu.component';
import { AddOptionInMenuByMenuComponent } from './option-in-menu-by-menu/add-option-in-menu-by-menu/add-option-in-menu-by-menu.component';
import { EditOptionInMenuByMenuComponent } from './option-in-menu-by-menu/edit-option-in-menu-by-menu/edit-option-in-menu-by-menu.component';
import { MenuInRoleComponent } from './menu-in-role/menu-in-role.component';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';
import { NgxMaskModule } from 'ngx-mask';
import { SecurityRoutingModule } from './security-routing.module';
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
import { UserStateComponent } from './user-state/user-state.component';
import { AddUserStateComponent } from './user-state/add-user-state/add-user-state.component';
import { EditUserStateComponent } from './user-state/edit-user-state/edit-user-state.component';


@NgModule({
  declarations: [SecurityHomeComponent, OptionComponent, AddOptionComponent, EditOptionComponent,
    MenuComponent, AddMenuComponent, EditMenuComponent, RoleComponent, AddRoleComponent, EditRoleComponent,
    OptionInMenuByMenuComponent, AddOptionInMenuByMenuComponent, EditOptionInMenuByMenuComponent,
    MenuInRoleComponent, EditCompanyComponent,
    UserStateComponent, AddUserStateComponent, EditUserStateComponent,],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    SecurityRoutingModule,
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

export class SecurityModule { }
