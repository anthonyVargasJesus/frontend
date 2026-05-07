import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from 'environments/environment';
import { ActivesInventoryInDefaultRisk } from 'app/models/actives-inventory-in-default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { ApiResponse } from 'app/models/common/api-response.interface';
import { ApiSingleResponse } from 'app/models/common/api-single-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ActivesInventoryInDefaultRiskService {
  private readonly endpoint = `${environment.apiUrl}/api/activesInventoryInDefaultRisk`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene inventario por defaultRiskId con paginación y búsqueda
   */
  getBydefaultRiskId(
    skip: number = 0, 
    pageSize: number = 10, 
    defaultRiskId: number, 
    search: string = ''
  ): Observable<ApiResponse<ActivesInventoryInDefaultRisk>> {
    
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('pageSize', pageSize.toString())
      .set('defaultRiskId', defaultRiskId.toString())
      .set('search', search);

    return this.http.get<ApiResponse<ActivesInventoryInDefaultRisk>>(this.endpoint, { params });
  }

  /**
   * Obtiene un registro por ID
   */
  obtain(id: string | number): Observable<ApiSingleResponse<ActivesInventoryInDefaultRisk>> {
    return this.http.get<ApiSingleResponse<ActivesInventoryInDefaultRisk>>(`${this.endpoint}/${id}`);
  }

  /**
   * Registra un nuevo activo en riesgo por defecto
   */
  insert(payload: ActivesInventoryInDefaultRisk): Observable<ApiSingleResponse<ActivesInventoryInDefaultRisk>> {
    return this.http.post<ApiSingleResponse<ActivesInventoryInDefaultRisk>>(this.endpoint, payload).pipe(
      tap(() => this.notify('Activo registrado', 'El activo se registró satisfactoriamente')),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un registro existente
   */
  update(payload: ActivesInventoryInDefaultRisk): Observable<ApiSingleResponse<ActivesInventoryInDefaultRisk>> {
    const url = `${this.endpoint}/${payload.activesInventoryInDefaultRiskId}`;
    return this.http.put<ApiSingleResponse<ActivesInventoryInDefaultRisk>>(url, payload).pipe(
      tap(() => this.notify('Activo actualizado', 'El activo se actualizó satisfactoriamente')),
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un registro del inventario
   */
  delete(id: number): Observable<ApiSingleResponse<void>> {
    return this.http.delete<ApiSingleResponse<void>>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.notify('Activo eliminado', 'El activo se eliminó satisfactoriamente')),
      catchError(this.handleError)
    );
  }

  // --- Helpers Privados ---

  private notify(title: string, message: string): void {
    Swal.fire(title, message, 'success');
  }

  private handleError(error: any): Observable<never> {
    ErrorManager.handleError(error);
    return throwError(error);
  }
}