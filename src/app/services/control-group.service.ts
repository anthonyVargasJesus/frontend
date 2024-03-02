import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlGroup } from 'app/models/control-group';

import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})

export class ControlGroupService {

  constructor(public http: HttpClient) { }

  getAll() {
    const url = environment.apiUrl + '/api/controlGroup/all';
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string, standardId: number) {
    const url = environment.apiUrl + '/api/controlGroup' + '?skip=' + skip + '&pageSize=' + pageSize + '&standardId=' + standardId + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/controlGroup/' + id;
    return this.http.get(url);
  }

  insert(controlGroup: ControlGroup) {
    const url = environment.apiUrl + '/api/controlGroup';
    return this.http.post(url, controlGroup)
      .pipe(map((resp: any) => {
        Swal.fire('Grupo registrado', 'El grupo se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(controlGroup: ControlGroup) {
    const url = environment.apiUrl + '/api/controlGroup/' + controlGroup.controlGroupId.toString();
    return this.http.put(url, controlGroup)
      .pipe(map((resp: any) => {
        Swal.fire('Grupo actualizado', 'El grupo se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/controlGroup/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Grupo eliminado', 'El grupo se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
