import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Indicator } from 'app/models/indicator';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})

export class IndicatorService {

  constructor(public http: HttpClient) { }

  getAll() {
    const url = environment.apiUrl + '/api/indicator/all';
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string) {
    const url = environment.apiUrl + '/api/indicator' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/indicator/' + id;
    return this.http.get(url);
  }

  insert(indicator: Indicator) {
    const url = environment.apiUrl + '/api/indicator';
    return this.http.post(url, indicator)
      .pipe(map((resp: any) => {
        Swal.fire('Indicador registrado', 'El indicador se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(indicator: Indicator) {
    const url = environment.apiUrl + '/api/indicator/' + indicator.indicatorId.toString();
    return this.http.put(url, indicator)
      .pipe(map((resp: any) => {
        Swal.fire('Indicador actualizado', 'El indicador se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/indicator/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Indicador eliminado', 'El indicador se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
