import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from 'environments/environment';
import { ActiveType } from 'app/models/active-type';
import { ErrorManager } from 'app/errors/error-manager';
import { ApiResponse } from 'app/models/common/api-response.interface';
import { ApiSingleResponse } from 'app/models/common/api-single-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ActiveTypeService {
  private readonly endpoint = `${environment.apiUrl}/api/activeType`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los tipos de activos
   */
  getAll(): Observable<ApiResponse<ActiveType>> {
    return this.http.get<ApiResponse<ActiveType>>(`${this.endpoint}/all`);
  }

  /**
   * Obtiene tipos de activos con paginación y búsqueda
   */
  get(skip: number = 0, pageSize: number = 10, search: string = ''): Observable<ApiResponse<ActiveType>> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search);

    return this.http.get<ApiResponse<ActiveType>>(this.endpoint, { params });
  }

  /**
   * Obtiene un registro por ID
   */
  obtain(id: string | number): Observable<ApiSingleResponse<ActiveType>> {
    return this.http.get<ApiSingleResponse<ActiveType>>(`${this.endpoint}/${id}`);
  }

  /**
   * Inserta un nuevo tipo de activo
   */
  insert(payload: ActiveType): Observable<ApiSingleResponse<ActiveType>> {
    return this.http.post<ApiSingleResponse<ActiveType>>(this.endpoint, payload).pipe(
      tap(() => this.notify('Tipo registrado', 'El tipo se registró satisfactoriamente')),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un tipo de activo existente
   */
  update(payload: ActiveType): Observable<ApiSingleResponse<ActiveType>> {
    const url = `${this.endpoint}/${payload.activeTypeId}`;
    return this.http.put<ApiSingleResponse<ActiveType>>(url, payload).pipe(
      tap(() => this.notify('Tipo actualizado', 'El tipo se actualizó satisfactoriamente')),
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un tipo de activo
   */
  delete(id: number): Observable<ApiSingleResponse<void>> {
    return this.http.delete<ApiSingleResponse<void>>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.notify('Tipo eliminado', 'El tipo se eliminó satisfactoriamente')),
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