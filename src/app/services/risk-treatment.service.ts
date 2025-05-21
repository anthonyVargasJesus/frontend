import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskTreatment } from 'app/models/risk-treatment';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RiskTreatmentService {

    constructor(public http: HttpClient) { }


    obtain(id: string) {
        const url = environment.apiUrl + '/api/riskTreatment/' + id;
        return this.http.get(url);
    }

    insert(riskTreatment: RiskTreatment) {
        const url = environment.apiUrl + '/api/riskTreatment';
        return this.http.post(url, riskTreatment)
            .pipe(map((resp: any) => {
                Swal.fire('RiskTreatment registrado', 'El RiskTreatment se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(riskTreatment: RiskTreatment) {
        const url = environment.apiUrl + '/api/riskTreatment/' + riskTreatment.riskTreatmentId;
        return this.http.put(url, riskTreatment)
            .pipe(map((resp: any) => {
                Swal.fire('RiskTreatment actualizado', 'El RiskTreatment se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

}

