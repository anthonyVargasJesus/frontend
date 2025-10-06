import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlanStatus } from 'app/models/action-plan-status';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ActionPlanStatusService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/actionPlanStatus/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/actionPlanStatus' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/actionPlanStatus/' + id;
        return this.http.get(url);
    }

    insert(actionPlanStatus: ActionPlanStatus) {
        const url = environment.apiUrl + '/api/actionPlanStatus';
        return this.http.post(url, actionPlanStatus)
            .pipe(map((resp: any) => {
                Swal.fire('¡Éxito!', 'El registro se inglesó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(actionPlanStatus: ActionPlanStatus) {
        const url = environment.apiUrl + '/api/actionPlanStatus/' + actionPlanStatus.actionPlanStatusId;
        return this.http.put(url, actionPlanStatus)
            .pipe(map((resp: any) => {
                Swal.fire('¡Éxito!', 'El registro se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/actionPlanStatus/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('¡Éxito!', 'El registro se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

