import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import Swal from 'sweetalert2';
import { ErrorManager } from 'app/errors/error-manager';
import { User } from 'app/models/user';
import { redirectToLogin } from 'app/config/config';

@Component({
  selector: 'app-auth-forgot-password',
  templateUrl: './auth-forgot-password.component.html',
  styleUrls: ['./auth-forgot-password.component.scss']
})
export class AuthForgotPasswordComponent implements OnInit {

  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */

  loading = false;

  constructor(private _coreConfigService: CoreConfigService, private _formBuilder: FormBuilder, private _route: ActivatedRoute,
    private loginService: LoginService, public router: Router) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.onReset(this.forgotPasswordForm.value.email);

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  async onReset(email) {

    try {

      this.loading = true;

      if (!email) {
        Swal.fire('Validación de correo', 'Debes ingresar el correo', 'error');
        this.loading = false;
        return;
      }

      let user: User = new User();
      user.email = email;
      //await this.authSvc.resetPassword(email);
      Swal.fire('Restablecimiento de contraseña', 'Se envió un correo a ' + email, 'success');
      this.router.navigate(['/pages/authentication/login-v2']);
      this.loading = false;

      // this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }

}
