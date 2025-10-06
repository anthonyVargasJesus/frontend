import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlan } from 'app/models/action-plan';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ActionPlanService {

    constructor(public http: HttpClient) { }

    getBybreachId(skip: number, pageSize: number, breachId: number, search: string) {
        const url = environment.apiUrl + '/api/actionPlan' + '?skip=' + skip + '&pageSize=' + pageSize + '&breachId=' + breachId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/actionPlan/' + id;
        return this.http.get(url);
    }

    insert(actionPlan: ActionPlan) {
        const url = environment.apiUrl + '/api/actionPlan';
        return this.http.post(url, actionPlan)
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

    update(actionPlan: ActionPlan) {
        const url = environment.apiUrl + '/api/actionPlan/' + actionPlan.actionPlanId;
        return this.http.put(url, actionPlan)
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
        const url = environment.apiUrl + '/api/actionPlan/' + id;
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

