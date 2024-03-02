import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Standard } from 'app/models/standard';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})

export class StandardService {

  constructor(public http: HttpClient) { }

  getAll() {
    const url = environment.apiUrl + '/api/standard/all';
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string) {
    const url = environment.apiUrl + '/api/standard' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/standard/' + id;
    return this.http.get(url);
  }

  insert(standard: Standard) {
    const url = environment.apiUrl + '/api/standard';
    return this.http.post(url, standard)
      .pipe(map((resp: any) => {
        Swal.fire('Norma registrada', 'La norma se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(standard: Standard) {
    const url = environment.apiUrl + '/api/standard/' + standard.standardId;
    return this.http.put(url, standard)
      .pipe(map((resp: any) => {
        Swal.fire('Norma actualizada', 'La norma se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/standard/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Norma eliminada', 'La norma se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
