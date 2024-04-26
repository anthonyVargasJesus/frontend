import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Approver } from 'app/models/approver';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ApproverService {

    constructor(public http: HttpClient) { }

    getAllByversionId(versionId: number,) {
        const url = environment.apiUrl + '/api/approver/all?' + '&versionId=' + versionId;
        return this.http.get(url);
    }

    getByversionId(skip: number, pageSize: number, versionId: number, search: string) {
        const url = environment.apiUrl + '/api/approver' + '?skip=' + skip + '&pageSize=' + pageSize + '&versionId=' + versionId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/approver/' + id;
        return this.http.get(url);
    }

    insert(approver: Approver) {
        const url = environment.apiUrl + '/api/approver';
        return this.http.post(url, approver)
            .pipe(map((resp: any) => {
                Swal.fire('Approver registrado', 'El Approver se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(approver: Approver) {
        const url = environment.apiUrl + '/api/approver/' + approver.approverId;
        return this.http.put(url, approver)
            .pipe(map((resp: any) => {
                Swal.fire('Approver actualizado', 'El Approver se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/approver/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Approver eliminado', 'El Approver se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

