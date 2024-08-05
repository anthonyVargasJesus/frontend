import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlEvaluation } from 'app/models/control-evaluation';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ControlEvaluationService {

    constructor(public http: HttpClient) { }

    
    getAllByStandardIdByEvaluationId(standardId: number, evaluationId: number) {
        const url = environment.apiUrl + '/api/controlEvaluation/all?' + 'standardId=' + standardId + '&evaluationId=' + evaluationId;
        return this.http.get(url);
    }

    getBycontrolId(skip: number, pageSize: number, controlId: number) {
        const url = environment.apiUrl + '/api/controlEvaluation' + '?skip=' + skip + '&pageSize=' + pageSize + '&controlId=' + controlId;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/controlEvaluation/' + id;
        return this.http.get(url);
    }

    insert(controlEvaluation: ControlEvaluation) {
        const url = environment.apiUrl + '/api/controlEvaluation';
        return this.http.post(url, controlEvaluation)
            .pipe(map((resp: any) => {
                Swal.fire('Control registrado', 'El control se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(controlEvaluation: ControlEvaluation) {
        const url = environment.apiUrl + '/api/controlEvaluation/' + controlEvaluation.controlEvaluationId;
        return this.http.put(url, controlEvaluation)
            .pipe(map((resp: any) => {
                Swal.fire('Control actualizado', 'El control se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/controlEvaluation/' + id ;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Control eliminado', 'El control se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

