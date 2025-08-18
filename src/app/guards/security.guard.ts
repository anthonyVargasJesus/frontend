import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { CODE_SECURITY_MODULE } from 'app/config/config';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SecurityGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(): boolean | UrlTree {

    // 1. Verifica autenticación
    if (!this.loginService.isAuthenticated())
      return this.handleAccessDenied('Sesión no válida o expirada');

    // 2. Decodifica token
    const user = this.loginService.getCurrentUser();

    if (!user || typeof user.rls !== 'string')
      return this.handleAccessDenied('Token inválido o sin roles asignados');

    let roles: string[];
    try {
      // rls viene como string JSON → ["DEV", "ADMIN"]
      roles = JSON.parse(user.rls);
    } catch (e) {
      return this.handleAccessDenied('Error al leer los roles del token');
    }

    // 3. Verifica si el rol esperado está presente
    const hasDevRole = roles.includes(CODE_SECURITY_MODULE);
    if (!hasDevRole)
      return this.handleAccessDenied('Esta sección no está disponible para su perfil de usuario.');
    
    return true;
  }

  private handleAccessDenied(message: string): UrlTree {
    Swal.fire('Acceso Restringido', message, 'error');
    if (this.loginService.isAuthenticated())
      return this.router.createUrlTree(['/pages/miscellaneous/not-authorized']);
    else
      return this.router.createUrlTree(['/pages/authentication/login-v2']);
  }

}
