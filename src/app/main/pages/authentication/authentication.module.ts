import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { AuthForgotPasswordComponent } from './auth-forgot-password/auth-forgot-password.component';
import { AuthSendMailComponent } from './auth-send-mail/auth-send-mail.component';

// routing
const routes: Routes = [
  {
    path: 'authentication/send-mail/:id',
    component: AuthSendMailComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/login-v2',
    component: AuthLoginV2Component,
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/forgot-password',
    component: AuthForgotPasswordComponent,
    data: { animation: 'auth' }
  },
];

@NgModule({
  declarations: [AuthLoginV2Component, AuthForgotPasswordComponent, AuthSendMailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule]
})
export class AuthenticationModule {}
