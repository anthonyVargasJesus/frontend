import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlInDefaultRisk } from 'app/models/control-in-default-risk';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ControlInDefaultRiskService {

    constructor(public http: HttpClient) { }

    getAllBycontrolId(controlId: number,) {
        const url = environment.apiUrl + '/api/controlInDefaultRisk/all?' + '&controlId=' + controlId;
        return this.http.get(url);
    }

    getBycontrolId(skip: number, pageSize: number, controlId: number, search: string) {
        const url = environment.apiUrl + '/api/controlInDefaultRisk' + '?skip=' + skip + '&pageSize=' + pageSize + '&controlId=' + controlId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/controlInDefaultRisk/' + id;
        return this.http.get(url);
    }

    insert(controlInDefaultRisk: ControlInDefaultRisk) {
        const url = environment.apiUrl + '/api/controlInDefaultRisk';
        return this.http.post(url, controlInDefaultRisk)
            .pipe(map((resp: any) => {
                Swal.fire('Riesgo registrado', 'El riesgo se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(controlInDefaultRisk: ControlInDefaultRisk) {
        const url = environment.apiUrl + '/api/controlInDefaultRisk/' + controlInDefaultRisk.controlInDefaultRiskId;
        return this.http.put(url, controlInDefaultRisk)
            .pipe(map((resp: any) => {
                Swal.fire('Riesgo actualizado', 'El riesgo se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/controlInDefaultRisk/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Riesgo eliminado', 'El riesgo se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

