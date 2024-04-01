import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Responsible } from 'app/models/responsible';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})

export class ResponsibleService {

  constructor(public http: HttpClient) { }

  getAll(standardId: number) {
    const url = environment.apiUrl + '/api/responsible/all?standardId=' + standardId;
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string, standardId: number) {
    const url = environment.apiUrl + '/api/responsible' + '?skip=' + skip + '&pageSize=' + pageSize + '&standardId=' + standardId + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/responsible/' + id;
    return this.http.get(url);
  }

  insert(responsible: Responsible) {
    const url = environment.apiUrl + '/api/responsible';
    return this.http.post(url, responsible)
      .pipe(map((resp: any) => {
        Swal.fire('Responsable registrado', 'El responsable se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(responsible: Responsible) {
    const url = environment.apiUrl + '/api/responsible/' + responsible.responsibleId.toString();
    return this.http.put(url, responsible)
      .pipe(map((resp: any) => {
        Swal.fire('Responsable actualizado', 'El responsable se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/responsible/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Responsable eliminado', 'El responsable se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
