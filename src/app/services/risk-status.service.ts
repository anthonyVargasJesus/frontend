import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskStatus } from 'app/models/risk-status';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RiskStatusService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/riskStatus/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/riskStatus' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/riskStatus/' + id;
        return this.http.get(url);
    }

    insert(riskStatus: RiskStatus) {
        const url = environment.apiUrl + '/api/riskStatus';
        return this.http.post(url, riskStatus)
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

    update(riskStatus: RiskStatus) {
        const url = environment.apiUrl + '/api/riskStatus/' + riskStatus.riskStatusId;
        return this.http.put(url, riskStatus)
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
        const url = environment.apiUrl + '/api/riskStatus/' + id;
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

