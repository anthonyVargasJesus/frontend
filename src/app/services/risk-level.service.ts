import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskLevel } from 'app/models/risk-level';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RiskLevelService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/riskLevel/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/riskLevel' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/riskLevel/' + id;
        return this.http.get(url);
    }

    insert(riskLevel: RiskLevel) {
        const url = environment.apiUrl + '/api/riskLevel';
        return this.http.post(url, riskLevel)
            .pipe(map((resp: any) => {
                Swal.fire('RiskLevel registrado', 'El RiskLevel se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(riskLevel: RiskLevel) {
        const url = environment.apiUrl + '/api/riskLevel/' + riskLevel.riskLevelId;
        return this.http.put(url, riskLevel)
            .pipe(map((resp: any) => {
                Swal.fire('RiskLevel actualizado', 'El RiskLevel se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/riskLevel/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('RiskLevel eliminado', 'El RiskLevel se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

