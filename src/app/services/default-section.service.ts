import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { DefaultSection } from 'app/models/default-section';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class DefaultSectionService {

  constructor(public http: HttpClient) { }

  getAll(documentTypeId: number) {
    const url = environment.apiUrl + '/api/defaultSection/all' + '?documentTypeId=' + documentTypeId;
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string, documentTypeId: number) {
    console.log('dtt', documentTypeId)
    const url = environment.apiUrl + '/api/defaultSection' + '?skip=' + skip + '&pageSize=' + pageSize + '&documentTypeId=' + documentTypeId + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/defaultSection/' + id;
    return this.http.get(url);
  }

  insert(defaultSection: DefaultSection) {
    const url = environment.apiUrl + '/api/defaultSection';
    return this.http.post(url, defaultSection)
      .pipe(map((resp: any) => {
        Swal.fire('Sección registrada', 'El sección se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(defaultSection: DefaultSection) {
    const url = environment.apiUrl + '/api/defaultSection/' + defaultSection.defaultSectionId;
    return this.http.put(url, defaultSection)
      .pipe(map((resp: any) => {
        Swal.fire('Sección actualizada', 'El sección se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/defaultSection/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Sección eliminada', 'La sección se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
