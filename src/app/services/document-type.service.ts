import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { DocumentType } from 'app/models/document-type';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  constructor(public http: HttpClient) { }

  getAll() {
    const url = environment.apiUrl + '/api/documentType/all';
    return this.http.get(url);
  }

  get(skip: number, pageSize: number, search: string) {
    const url = environment.apiUrl + '/api/documentType' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
    return this.http.get(url);
  }

  obtain(id: string) {
    const url = environment.apiUrl + '/api/documentType/' + id;
    return this.http.get(url);
  }

  insert(documentType: DocumentType) {
    const url = environment.apiUrl + '/api/documentType';
    return this.http.post(url, documentType)
      .pipe(map((resp: any) => {
        Swal.fire('Tipo de documento registrado', 'El tipo de documento se registró satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  update(documentType: DocumentType) {
    const url = environment.apiUrl + '/api/documentType/' + documentType.documentTypeId;
    return this.http.put(url, documentType)
      .pipe(map((resp: any) => {
        Swal.fire('Tipo de documento actualizado', 'El tipo de documento se actualizó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

  delete(id: string) {
    const url = environment.apiUrl + '/api/documentType/' + id ;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        Swal.fire('Tipo de documento eliminada', 'La tipo de documento se eliminó satisfactoriamente', 'success');
        return resp;
      }
      ))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }


}
