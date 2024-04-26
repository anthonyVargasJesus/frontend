import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { SupportForControl } from 'app/models/support-for-control';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class SupportForControlService {

    constructor(public http: HttpClient) { }

    get(skip: number, pageSize: number, search: string, documentationId: number) {
        const url = environment.apiUrl + '/api/supportForControl' + '?skip=' + skip + '&pageSize=' + pageSize + '&documentationId=' + documentationId + '&search=' + search ;
        return this.http.get(url);
      }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/supportForControl/' + id;
        return this.http.get(url);
    }

    insert(supportForControl: SupportForControl) {
        const url = environment.apiUrl + '/api/supportForControl';
        return this.http.post(url, supportForControl)
            .pipe(map((resp: any) => {
                Swal.fire('SupportForControl registrado', 'El SupportForControl se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(supportForControl: SupportForControl) {
        const url = environment.apiUrl + '/api/supportForControl/' + supportForControl.supportForControlId;
        return this.http.put(url, supportForControl)
            .pipe(map((resp: any) => {
                Swal.fire('SupportForControl actualizado', 'El SupportForControl se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: string) {
        const url = environment.apiUrl + '/api/supportForControl/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('SupportForControl eliminado', 'El SupportForControl se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

