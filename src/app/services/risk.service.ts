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

    getMonitoring(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/risk/GetMonitoring' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    // evaluationId opcional: sin él, el backend lo resuelve a la evaluación "actual" — mismo
    // criterio que getComplianceEvolution en evaluation.service.ts.
    getHeatmap(evaluationId?: number) {
        let url = environment.apiUrl + '/api/risk/Heatmap';
        if (evaluationId) url += '?evaluationId=' + evaluationId;
        return this.http.get<any>(url);
    }

    getByevaluationId(skip: number, pageSize: number, riskStatusId: number, search: string) {
        const url = environment.apiUrl + '/api/risk' + '?skip=' + skip + '&pageSize=' + pageSize + '&riskStatusId=' + riskStatusId + '&search=' + search;
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
                Swal.fire('Riesgo registrado', 'El riesgo se registró satisfactoriamente', 'success');
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
                Swal.fire('Riesgo actualizado', 'El riesgo se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    updateStatus(id: number, riskStatusId: number) {
        const url = environment.apiUrl + '/api/risk/status?riskId=' + id + '&riskStatusId=' + riskStatusId;
        let body = {};
        return this.http.put(url, body)
            .pipe(map((resp: any) => {
                Swal.fire('Estado actualizado', 'El estado actualizó satisfactoriamente', 'success');
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
                Swal.fire('Riesgo eliminado', 'El riesgo se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}
