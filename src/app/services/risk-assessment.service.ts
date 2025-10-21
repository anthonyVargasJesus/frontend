import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskAssessment } from 'app/models/risk-assessment';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RiskAssessmentService {

    constructor(public http: HttpClient) { }


    obtain(id: number) {
        const url = environment.apiUrl + '/api/riskAssessment/' + id;
        return this.http.get(url);
    }

    insert(riskAssessment: RiskAssessment) {
        const url = environment.apiUrl + '/api/riskAssessment';
        return this.http.post(url, riskAssessment)
            .pipe(map((resp: any) => {
                Swal.fire('Evaluación registrada', 'La evaluación se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(riskAssessment: RiskAssessment) {
        const url = environment.apiUrl + '/api/riskAssessment/' + riskAssessment.riskAssessmentId;
        return this.http.put(url, riskAssessment)
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
        const url = environment.apiUrl + '/api/riskAssessment/' + id;
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

