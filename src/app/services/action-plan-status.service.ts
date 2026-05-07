import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from 'environments/environment';
import { ActionPlanStatus } from 'app/models/action-plan-status';
import { ErrorManager } from 'app/errors/error-manager';
import { ApiResponse } from 'app/models/common/api-response.interface';
import { ApiSingleResponse } from 'app/models/common/api-single-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionPlanStatusService {
  private readonly endpoint = `${environment.apiUrl}/api/actionPlanStatus`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los estados sin paginación
   */
  getAll(): Observable<ApiResponse<ActionPlanStatus>> {
    return this.http.get<ApiResponse<ActionPlanStatus>>(`${this.endpoint}/all`);
  }

  /**
   * Obtiene estados con paginación y búsqueda
   */
  get(skip: number = 0, pageSize: number = 10, search: string = ''): Observable<ApiResponse<ActionPlanStatus>> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search);

    return this.http.get<ApiResponse<ActionPlanStatus>>(this.endpoint, { params });
  }

  /**
   * Obtiene un estado por ID envuelto en el sobre de respuesta única
   */
  obtain(id: string | number): Observable<ApiSingleResponse<ActionPlanStatus>> {
    return this.http.get<ApiSingleResponse<ActionPlanStatus>>(`${this.endpoint}/${id}`);
  }

  /**
   * Inserta un nuevo estado
   */
  insert(payload: ActionPlanStatus): Observable<ApiSingleResponse<ActionPlanStatus>> {
    return this.http.post<ApiSingleResponse<ActionPlanStatus>>(this.endpoint, payload).pipe(
      tap(() => this.notify('ingresó')),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un estado existente
   */
  update(payload: ActionPlanStatus): Observable<ApiSingleResponse<ActionPlanStatus>> {
    const url = `${this.endpoint}/${payload.actionPlanStatusId}`;
    return this.http.put<ApiSingleResponse<ActionPlanStatus>>(url, payload).pipe(
      tap(() => this.notify('actualizó')),
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un estado por ID
   */
  delete(id: number): Observable<ApiSingleResponse<void>> {
    return this.http.delete<ApiSingleResponse<void>>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.notify('eliminó')),
      catchError(this.handleError)
    );
  }

  // --- Helpers Privados ---

  /**
   * Centraliza las notificaciones de éxito
   */
  private notify(action: string): void {
    Swal.fire('¡Éxito!', `El registro se ${action} satisfactoriamente`, 'success');
  }

  /**
   * Gestiona los errores de la petición
   */
  private handleError(error: any): Observable<never> {
    ErrorManager.handleError(error);
    return throwError(error);
  }
}