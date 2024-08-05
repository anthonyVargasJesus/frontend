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

    getCurrent() {
        const url = environment.apiUrl + '/api/evaluation/current';
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

    getAll() {
        const url = environment.apiUrl + '/api/evaluation/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/evaluation' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
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
                Swal.fire('Evaluation registrado', 'El Evaluation se registró satisfactoriamente', 'success');
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
                Swal.fire('Evaluación actualizada', 'El Evaluation se actualizó satisfactoriamente', 'success');
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
                Swal.fire('Evaluación eliminada', 'El Evaluation se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
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
