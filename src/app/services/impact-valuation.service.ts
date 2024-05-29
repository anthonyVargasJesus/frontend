import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ImpactValuation } from 'app/models/impact-valuation';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ImpactValuationService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/impactValuation/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/impactValuation' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/impactValuation/' + id;
        return this.http.get(url);
    }

    insert(impactValuation: ImpactValuation) {
        const url = environment.apiUrl + '/api/impactValuation';
        return this.http.post(url, impactValuation)
            .pipe(map((resp: any) => {
                Swal.fire('Valoración registrada', 'La valoración se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(impactValuation: ImpactValuation) {
        const url = environment.apiUrl + '/api/impactValuation/' + impactValuation.impactValuationId;
        return this.http.put(url, impactValuation)
            .pipe(map((resp: any) => {
                Swal.fire('Valoración actualizado', 'La valoración se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/impactValuation/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Valoración eliminado', 'La valoración se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

