import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionComponent } from './option/option.component';
import { MenuComponent } from './menu/menu.component';
import { RoleComponent } from './role/role.component';
import { SecurityHomeComponent } from './security-home/security-home.component';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';
import { SecurityGuard } from 'app/guards/security.guard';

import { UserStateComponent } from './user-state/user-state.component';

const routes: Routes = [
    { path: 'edit-company', component: EditCompanyComponent, },
    { path: 'option', component: OptionComponent, },
    { path: 'menu', component: MenuComponent, },
    { path: 'role', component: RoleComponent, },
    { path: 'security-home', component: SecurityHomeComponent },
    { path: 'user-state', component: UserStateComponent,},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class SecurityRoutingModule { }