import { Injectable, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import Swal from 'sweetalert2'
import { LoginModel } from 'app/models/login-model';
import { environment } from 'environments/environment';
import { redirectToLogin } from 'app/config/config';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(public http: HttpClient, public router: Router) {
  }

  public getCurrentUser(): LoginModel {

    const token = localStorage.getItem('tk');

    if (!token) {
      Swal.fire('Acceso Restringido', 'Debe iniciar sesión', 'error');
      redirectToLogin(this.router);
      return null;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      Swal.fire('Acceso Restringido', 'Su sesión ha expirado', 'error');
      redirectToLogin(this.router);
      return null;
    }

    const decodedToken = this.jwtHelper.decodeToken(token);

    return decodedToken;

  }

  public getCurrentUserToNav(): LoginModel {

    let loginModel = new LoginModel();

    const token = localStorage.getItem('tk');

    if (!token) {
      return loginModel;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      return loginModel;
    }

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.user;

  }

  login(email: string, password: string) {

    const url = environment.apiUrl + '/api/login';

    let payload = {
      "email": email,
      "password": password,
    };

    return this.http.post(url, payload)
      .pipe(map((resp: any) => {

        localStorage.setItem('tk', resp.data.token);

          this.router.navigate(['/evaluation-process-list']);

        return true;
      }

      ))
      .pipe(catchError((error) => {
        return throwError(error);
      }));

  }

  loginFirebase(user: User) {

    const url = environment.apiUrl + '/api/login';

    let payload = {
      "tokenFirebase": user.token,
      "email": user.email,
      "uid": user.uid,
      // "user": {
      //   "email": user.email,
      // }
    };

    return this.http.post(url, payload)
      .pipe(map((resp: any) => {

        localStorage.setItem('tk', resp.data.token);
        this.router.navigate(['/home']);
        return true;
      }

      ))
      .pipe(catchError((error) => {
        return throwError(error);
      }));

  }


  logout() {
    localStorage.removeItem('tk');
  }

  public decodeToken(): any {

    const token = localStorage.getItem('tk');

    if (!token) {
      Swal.fire('Acceso Restringido', 'No hay token - decodeToken', 'error');
      redirectToLogin(this.router);
      return;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      Swal.fire('Acceso Restringido', 'Token expirado - decodeToken', 'error');
      redirectToLogin(this.router);
      return;
    }

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.user;

  }

  public isAuthenticated(): boolean {

    const token = localStorage.getItem('tk');


    if (!token) {
      Swal.fire('Acceso Restringido', 'Debe iniciar sesión', 'error');
      redirectToLogin(this.router);
      return false;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      Swal.fire('Acceso Restringido', 'Su sesión ha expirado', 'error');
      redirectToLogin(this.router);
      return false;
    }

    return true;

  }

  validateEmail(user: User) {
    let payload = {
      "token": user.token,
      "email": user.email,
      "uid": user.uid,
      "user": {
        "email": user.email,
      }
    };
    const url = environment.apiUrl + '/api/login/recovery-password';
    return this.http.post(url, payload);
  }


}
