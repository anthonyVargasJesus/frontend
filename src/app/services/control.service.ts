import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Control } from 'app/models/control';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})

export class ControlService {

  constructor(public http: HttpClient) { }



  get(skip: number, pageSize: number, search: string, controlGroupId: number) {
    const url = environment.apiUrl + '/api/control' + '?skip=' + skip + '&pageSize=' + pageSize + '&controlGroupId=' + controlGroupId + '&search=' + search ;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/control/' + id;
    return this.http.get(url);
  }

  insert(control: Control) {
    const url = environment.apiUrl + '/api/control';
    return this.http.post(url, control)
      .pipe(map((resp: any) => {
        Swal.fire('Control registrado', 'El control se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(control: Control) {
    const url = environment.apiUrl + '/api/control/' + control.controlId;
    return this.http.put(url, control)
      .pipe(map((resp: any) => {
        Swal.fire('Control actualizado', 'El control se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/control/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Control eliminadoa', 'El control se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
