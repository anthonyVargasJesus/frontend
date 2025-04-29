import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Risk } from 'app/models/risk';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RiskService {

    constructor(public http: HttpClient) { }

    getAllByevaluationId(evaluationId: number,) {
        const url = environment.apiUrl + '/api/risk/all/evaluation?' + '&evaluationId=' + evaluationId;
        return this.http.get(url);
    }

    getByevaluationId(skip: number, pageSize: number, evaluationId: number, search: string) {
        const url = environment.apiUrl + '/api/risk' + '?skip=' + skip + '&pageSize=' + pageSize + '&evaluationId=' + evaluationId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/risk/' + id;
        return this.http.get(url);
    }

    insert(risk: Risk) {
        const url = environment.apiUrl + '/api/risk';
        return this.http.post(url, risk)
            .pipe(map((resp: any) => {
                Swal.fire('Risk registrado', 'El Risk se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(risk: Risk) {
        const url = environment.apiUrl + '/api/risk/' + risk.riskId;
        return this.http.put(url, risk)
            .pipe(map((resp: any) => {
                Swal.fire('Risk actualizado', 'El Risk se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/risk/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Risk eliminado', 'El Risk se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}
