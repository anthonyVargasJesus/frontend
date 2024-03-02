import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { MaturityLevel } from 'app/models/maturity-level';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})

export class MaturityLevelService {

  constructor(public http: HttpClient) { }

  getAll() {
    const url = environment.apiUrl + '/api/maturityLevel/all';
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string) {
    const url = environment.apiUrl + '/api/maturityLevel' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/maturityLevel/' + id;
    return this.http.get(url);
  }

  insert(maturityLevel: MaturityLevel) {
    const url = environment.apiUrl + '/api/maturityLevel';
    return this.http.post(url, maturityLevel)
      .pipe(map((resp: any) => {
        Swal.fire('Nivel de madurez registrado', 'El nivel de madurez se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(maturityLevel: MaturityLevel) {
    const url = environment.apiUrl + '/api/maturityLevel/' + maturityLevel.maturityLevelId.toString();
    return this.http.put(url, maturityLevel)
      .pipe(map((resp: any) => {
        Swal.fire('Nivel de madurez actualizado', 'El nivel de madurez se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/maturityLevel/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Nivel de madurez eliminado', 'El nivel de madurez se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
