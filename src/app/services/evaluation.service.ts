import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Evaluation } from 'app/models/evaluation';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class EvaluationService {

    constructor(public http: HttpClient) { }

    // evaluationId opcional: sin él, trae la evaluación marcada como "actual" (comportamiento
    // histórico); con él, trae esa evaluación puntual (usado por el desplegable de "Resumen").
    getCurrent(evaluationId?: number) {
        let url = environment.apiUrl + '/api/evaluation/current';
        if (evaluationId) url += '?id=' + evaluationId;
        return this.http.get(url);
    }

    getDashboard(standardId: number, evaluationId: number) {
        const url = environment.apiUrl + '/api/evaluation/dashboard' + '?standardId='+ standardId + '&evaluationId=' + evaluationId;
        return this.http.get(url);
    }

    getControlDashboard(standardId: number, evaluationId: number) {
        const url = environment.apiUrl + '/api/evaluation/control-dashboard' + '?standardId='+ standardId + '&evaluationId=' + evaluationId;
        return this.http.get(url);
    }

    getPendingDocumentation(skip: number, pageSize: number,search: string, standardId: number, evaluationId: number) {
        const url = environment.apiUrl + '/api/evaluation/PendingDocumentation' + '?standardId='+ standardId + '&evaluationId=' + evaluationId +'&skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }


    getAll() {
        const url = environment.apiUrl + '/api/evaluation/all';
        return this.http.get(url);
    }

    // standardId opcional: sin él, trae evaluaciones de todas las normas de la compañía
    // mezcladas (comportamiento histórico); con él, solo las de esa norma — necesario
    // para diferenciarlas ahora que hay más de una norma cargada.
    get(skip: number, pageSize: number, search: string, standardId?: number) {
        let url = environment.apiUrl + '/api/evaluation' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        if (standardId) url += '&standardId=' + standardId;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/evaluation/' + id;
        return this.http.get(url);
    }

    insert(evaluation: Evaluation) {
        const url = environment.apiUrl + '/api/evaluation';
        return this.http.post(url, evaluation)
            .pipe(map((resp: any) => {
                Swal.fire('Evaluación registrado', 'La evaluación se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(evaluation: Evaluation) {
        const url = environment.apiUrl + '/api/evaluation/' + evaluation.evaluationId;
        return this.http.put(url, evaluation)
            .pipe(map((resp: any) => {
                Swal.fire('Evaluación actualizada', 'La evaluación se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/evaluation/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Evaluación eliminada', 'La evaluación se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


    // standardId opcional: sin él, el backend lo resuelve a la norma de la evaluación
    // "actual" — necesario desde que hay más de una norma cargada (antes se mezclaban
    // en una sola línea de tiempo todas las evaluaciones de la empresa).
    getComplianceEvolution(standardId?: number) {
        let url = environment.apiUrl + '/api/evaluation/compliance-evolution';
        if (standardId) url += '?standardId=' + standardId;
        return this.http.get<any>(url);
    }

    // standardId opcional: mismo criterio que getComplianceEvolution.
    getMaturityRadar(standardId?: number) {
        let url = environment.apiUrl + '/api/evaluation/maturity-radar';
        if (standardId) url += '?standardId=' + standardId;
        return this.http.get<any>(url);
    }

    getExcelDashboard(standardId: string, evaluationId: string) {

        const url = environment.apiUrl + '/api/evaluation/excel-dashboard?standardId=' + standardId + '&evaluationId=' + evaluationId;
    
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
