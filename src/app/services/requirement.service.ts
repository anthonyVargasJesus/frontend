import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Requirement } from 'app/models/requirement';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})

export class RequirementService {

  constructor(public http: HttpClient) { }

  getAll() {
    const url = environment.apiUrl + '/api/requirement/all';
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string, standardId: number) {
    const url = environment.apiUrl + '/api/requirement' + '?skip=' + skip + '&pageSize=' + pageSize + '&standardId=' + standardId + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/requirement/' + id;
    return this.http.get(url);
  }

  insert(requirement: Requirement) {
    const url = environment.apiUrl + '/api/requirement';
    return this.http.post(url, requirement)
      .pipe(map((resp: any) => {
        Swal.fire('Requisito registrado', 'El requisito se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(requirement: Requirement) {
    const url = environment.apiUrl + '/api/requirement/' + requirement.requirementId.toString();
    return this.http.put(url, requirement)
      .pipe(map((resp: any) => {
        Swal.fire('Requisito actualizado', 'El requisito se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/requirement/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Requisito eliminado', 'El requisito se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
