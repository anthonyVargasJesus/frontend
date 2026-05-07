import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from 'environments/environment';
import { ActionPlan } from 'app/models/action-plan';
import { ErrorManager } from 'app/errors/error-manager';
import { ApiResponse } from 'app/models/common/api-response.interface';
import { ApiSingleResponse } from 'app/models/common/api-single-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionPlanService {
  private readonly endpoint = `${environment.apiUrl}/api/actionPlan`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene planes de acción filtrados por breachId con paginación
   */
  getBybreachId(
    skip: number = 0, 
    pageSize: number = 10, 
    breachId: number, 
    search: string = ''
  ): Observable<ApiResponse<ActionPlan>> {
    
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('pageSize', pageSize.toString())
      .set('breachId', breachId.toString())
      .set('search', search);

    return this.http.get<ApiResponse<ActionPlan>>(this.endpoint, { params });
  }

  /**
   * Obtiene un registro único por ID
   */
  obtain(id: string | number): Observable<ApiSingleResponse<ActionPlan>> {
    return this.http.get<ApiSingleResponse<ActionPlan>>(`${this.endpoint}/${id}`);
  }

  /**
   * Inserta un nuevo plan de acción
   */
  insert(payload: ActionPlan): Observable<ApiSingleResponse<ActionPlan>> {
    return this.http.post<ApiSingleResponse<ActionPlan>>(this.endpoint, payload).pipe(
      tap(() => this.notify('ingresó')),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un plan de acción existente
   */
  update(payload: ActionPlan): Observable<ApiSingleResponse<ActionPlan>> {
    const url = `${this.endpoint}/${payload.actionPlanId}`;
    return this.http.put<ApiSingleResponse<ActionPlan>>(url, payload).pipe(
      tap(() => this.notify('actualizó')),
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un registro
   */
  delete(id: number): Observable<ApiSingleResponse<void>> {
    return this.http.delete<ApiSingleResponse<void>>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.notify('eliminó')),
      catchError(this.handleError)
    );
  }

  // --- Helpers Privados ---

  private notify(action: string): void {
    Swal.fire('¡Éxito!', `El registro se ${action} satisfactoriamente`, 'success');
  }

  private handleError(error: any): Observable<never> {
    ErrorManager.handleError(error);
    return throwError(error);
  }
}