import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ResidualRisk } from 'app/models/residual-risk';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ResidualRiskService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/residualRisk/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/residualRisk' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/residualRisk/' + id;
        return this.http.get(url);
    }

    insert(residualRisk: ResidualRisk) {
        const url = environment.apiUrl + '/api/residualRisk';
        return this.http.post(url, residualRisk)
            .pipe(map((resp: any) => {
                Swal.fire('ResidualRisk registrado', 'El ResidualRisk se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(residualRisk: ResidualRisk) {
        const url = environment.apiUrl + '/api/residualRisk/' + residualRisk.residualRiskId;
        return this.http.put(url, residualRisk)
            .pipe(map((resp: any) => {
                Swal.fire('ResidualRisk actualizado', 'El ResidualRisk se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/residualRisk/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('ResidualRisk eliminado', 'El ResidualRisk se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

