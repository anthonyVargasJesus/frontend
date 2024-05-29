import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Version } from 'app/models/version';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class VersionService {

    constructor(public http: HttpClient) { }


    getBydocumentationId(skip: number, pageSize: number, documentationId: number, search: string) {
        const url = environment.apiUrl + '/api/version' + '?skip=' + skip + '&pageSize=' + pageSize + '&documentationId=' + documentationId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/version/' + id;
        return this.http.get(url);
    }

    insert(version: Version) {
        const url = environment.apiUrl + '/api/version';
        return this.http.post(url, version)
            .pipe(map((resp: any) => {
                Swal.fire('Version registrado', 'El Version se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(version: Version) {
        const url = environment.apiUrl + '/api/version/' + version.versionId;
        return this.http.put(url, version)
            .pipe(map((resp: any) => {
                Swal.fire('Version actualizado', 'El Version se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: string) {
        const url = environment.apiUrl + '/api/version/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Version eliminado', 'El Version se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


    getWordDocument(versionId: string) {

        const url = environment.apiUrl + '/api/version/word-document?versionId=' + versionId;
    
        return this.http.get(url, { responseType: 'blob' })
          .pipe(map((resp: any) => {
            return resp;
          }
          ))
          .pipe(catchError((err) => {
            ErrorManager.handleError(err);
            return throwError(err);
          }));
    
      }

}

