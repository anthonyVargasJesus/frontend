import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ReferenceDocumentationService {

    constructor(public http: HttpClient) { }

    getByControlEvaluationId(skip: number, pageSize: number, controlEvaluationId: number, search: string) {
        const url = environment.apiUrl + '/api/referenceDocumentation/ByControl' + '?skip=' + skip + '&pageSize=' + pageSize + '&controlEvaluationId=' + controlEvaluationId + '&search=' + search;
        return this.http.get(url);
    }
    
    getByrequirementEvaluationId(skip: number, pageSize: number, requirementEvaluationId: number, search: string) {
        const url = environment.apiUrl + '/api/referenceDocumentation' + '?skip=' + skip + '&pageSize=' + pageSize + '&requirementEvaluationId=' + requirementEvaluationId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/referenceDocumentation/' + id;
        return this.http.get(url);
    }

    insert(referenceDocumentation: ReferenceDocumentation) {
        const url = environment.apiUrl + '/api/referenceDocumentation';
        return this.http.post(url, referenceDocumentation)
            .pipe(map((resp: any) => {
                Swal.fire('Evidencia registrada', 'La evidencia se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(referenceDocumentation: ReferenceDocumentation) {
        const url = environment.apiUrl + '/api/referenceDocumentation/' + referenceDocumentation.referenceDocumentationId;
        return this.http.put(url, referenceDocumentation)
            .pipe(map((resp: any) => {
                Swal.fire('Evidencia actualizada', 'La evidencia se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/referenceDocumentation/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Evidencia eliminada', 'La evidencia se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}
