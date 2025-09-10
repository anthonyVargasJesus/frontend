import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { DefaultRisk } from 'app/models/default-risk';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class DefaultRiskService {

    constructor(public http: HttpClient) { }

    getAllBystandardId(standardId: number,) {
        const url = environment.apiUrl + '/api/defaultRisk/all' + '?standardId=' + standardId;
        return this.http.get(url);
    }

    getBystandardId(skip: number, pageSize: number, standardId: number, search: string) {
        const url = environment.apiUrl + '/api/defaultRisk' + '?skip=' + skip + '&pageSize=' + pageSize + '&standardId=' + standardId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/defaultRisk/' + id;
        return this.http.get(url);
    }

    insert(defaultRisk: DefaultRisk) {
        const url = environment.apiUrl + '/api/defaultRisk';
        return this.http.post(url, defaultRisk)
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

    update(defaultRisk: DefaultRisk) {
        const url = environment.apiUrl + '/api/defaultRisk/' + defaultRisk.defaultRiskId;
        return this.http.put(url, defaultRisk)
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
        const url = environment.apiUrl + '/api/defaultRisk/' + id;
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

