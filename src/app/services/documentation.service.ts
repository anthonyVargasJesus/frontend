import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Documentation } from 'app/models/documentation';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})

export class DocumentationService {

  constructor(public http: HttpClient) { }

  getAll(standardId: number) {
    const url = environment.apiUrl + '/api/documentation/all?standardId=' + standardId;
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string, standardId: number) {
    const url = environment.apiUrl + '/api/documentation' + '?skip=' + skip + '&pageSize=' + pageSize + '&standardId=' + standardId + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/documentation/' + id;
    return this.http.get(url);
  }

  insert(documentation: Documentation) {
    const url = environment.apiUrl + '/api/documentation';
    return this.http.post(url, documentation)
      .pipe(map((resp: any) => {
        Swal.fire('Documento registrado', 'El documento se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(documentation: Documentation) {
    const url = environment.apiUrl + '/api/documentation/' + documentation.documentationId.toString();
    return this.http.put(url, documentation)
      .pipe(map((resp: any) => {
        Swal.fire('Documento actualizado', 'El documento se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/documentation/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Documento eliminado', 'El documento se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
