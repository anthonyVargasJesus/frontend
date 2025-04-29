import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskTreatmentMethod } from 'app/models/risk-treatment-method';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RiskTreatmentMethodService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/riskTreatmentMethod/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/riskTreatmentMethod' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/riskTreatmentMethod/' + id;
        return this.http.get(url);
    }

    insert(riskTreatmentMethod: RiskTreatmentMethod) {
        const url = environment.apiUrl + '/api/riskTreatmentMethod';
        return this.http.post(url, riskTreatmentMethod)
            .pipe(map((resp: any) => {
                Swal.fire('RiskTreatmentMethod registrado', 'El RiskTreatmentMethod se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(riskTreatmentMethod: RiskTreatmentMethod) {
        const url = environment.apiUrl + '/api/riskTreatmentMethod/' + riskTreatmentMethod.riskTreatmentMethodId;
        return this.http.put(url, riskTreatmentMethod)
            .pipe(map((resp: any) => {
                Swal.fire('RiskTreatmentMethod actualizado', 'El RiskTreatmentMethod se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/riskTreatmentMethod/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('RiskTreatmentMethod eliminado', 'El RiskTreatmentMethod se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

