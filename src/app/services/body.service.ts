import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Body } from 'app/models/body';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})

export class BodyService {

  constructor(public http: HttpClient) { }

  getAllByplanId(planId: number, ) {
    const url = environment.apiUrl + '/api/body/all/plan?' + 'planId=' + planId;
    return this.http.get(url);
    }

  get(skip: number, pageSize: number) {
    const url = environment.apiUrl + '/api/body' + '?skip=' + skip + '&pageSize=' + pageSize;
    return this.http.get(url);
  }

  search(search: string) {
    const url = environment.apiUrl + '/api/body/search/' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/body/' + id;
    return this.http.get(url);
  }

  insert(body: Body) {
    const url = environment.apiUrl + '/api/body';
    return this.http.post(url, body)
      .pipe(map((resp: any) => {
        Swal.fire('Cuerpo registrado', 'El cuerpo se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


  delete(id: string) {
    const url = environment.apiUrl + '/api/body/' + id;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Cuerpo eliminado', 'El cuerpo se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
