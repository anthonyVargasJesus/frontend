import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from 'environments/environment';
import { ActionPlanPriority } from 'app/models/action-plan-priority';
import { ErrorManager } from 'app/errors/error-manager';
import { ApiResponse } from 'app/models/common/api-response.interface';
import { ApiSingleResponse } from 'app/models/common/api-single-response.interface';


@Injectable({
  providedIn: 'root'
})
export class ActionPlanPriorityService {
  private readonly endpoint = `${environment.apiUrl}/api/actionPlanPriority`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<ActionPlanPriority>> {
    return this.http.get<ApiResponse<ActionPlanPriority>>(`${this.endpoint}/all`);
  }

  get(skip: number, pageSize: number, search: string): Observable<ApiResponse<ActionPlanPriority>> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search || '');

    return this.http.get<ApiResponse<ActionPlanPriority>>(this.endpoint, { params });
  }

  obtain(id: string | number): Observable<ApiSingleResponse<ActionPlanPriority>> {
    return this.http.get<ApiSingleResponse<ActionPlanPriority>>(`${this.endpoint}/${id}`);
  }

  insert(payload: ActionPlanPriority): Observable<ApiSingleResponse<ActionPlanPriority>> {
    return this.http.post<ApiSingleResponse<ActionPlanPriority>>(this.endpoint, payload).pipe(
      tap(() => this.notify('ingresó')),
      catchError(this.handleError)
    );
  }

  update(payload: ActionPlanPriority): Observable<ApiSingleResponse<ActionPlanPriority>> {
    const url = `${this.endpoint}/${payload.actionPlanPriorityId}`;
    return this.http.put<ApiSingleResponse<ActionPlanPriority>>(url, payload).pipe(
      tap(() => this.notify('actualizó')),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.notify('eliminó')),
      catchError(this.handleError)
    );
  }

  private notify(action: string): void {
    Swal.fire('¡Éxito!', `El registro se ${action} satisfactoriamente`, 'success');
  }

  private handleError(error: any): Observable<never> {
    ErrorManager.handleError(error);
    return throwError(error);
  }

}