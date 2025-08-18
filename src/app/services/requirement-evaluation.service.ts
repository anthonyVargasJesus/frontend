import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RequirementEvaluationService {

    constructor(public http: HttpClient) { }

    
    getAllByStandardIdByEvaluationId(standardId: number, evaluationId: number, search: string) {
        const url = environment.apiUrl + '/api/requirementEvaluation/all?' + 'standardId=' + standardId + '&evaluationId=' + evaluationId+ '&search=' + search;
        return this.http.get(url);
    }

    getByrequirementId(skip: number, pageSize: number, requirementId: number) {
        const url = environment.apiUrl + '/api/requirementEvaluation' + '?skip=' + skip + '&pageSize=' + pageSize + '&requirementId=' + requirementId;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/requirementEvaluation/' + id;
        return this.http.get(url);
    }

    insert(requirementEvaluation: RequirementEvaluation) {
        const url = environment.apiUrl + '/api/requirementEvaluation';
        return this.http.post(url, requirementEvaluation)
            .pipe(map((resp: any) => {
                Swal.fire('Requerimiento registrado', 'El requerimiento se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(requirementEvaluation: RequirementEvaluation) {
        const url = environment.apiUrl + '/api/requirementEvaluation/' + requirementEvaluation.requirementEvaluationId;
        return this.http.put(url, requirementEvaluation)
            .pipe(map((resp: any) => {
                Swal.fire('Requerimiento actualizado', 'El requerimiento se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/requirementEvaluation/' + id ;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Requerimiento eliminado', 'El requerimiento se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

