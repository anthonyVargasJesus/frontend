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
                Swal.fire('RiskAssessment registrado', 'El RiskAssessment se registró satisfactoriamente', 'success');
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
                Swal.fire('RiskAssessment actualizado', 'El RiskAssessment se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }



}

