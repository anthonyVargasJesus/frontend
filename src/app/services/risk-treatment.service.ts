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
                Swal.fire('Tratamiento registrado', 'El tratamiento se registró satisfactoriamente', 'success');
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
                Swal.fire('Tratamiento actualizado', 'El tratamiento se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/riskTreatment/' + id;
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

