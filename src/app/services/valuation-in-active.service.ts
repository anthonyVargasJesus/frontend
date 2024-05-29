import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ValuationInActive } from 'app/models/valuation-in-active';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ValuationInActiveService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/valuationInActive/all';
        return this.http.get(url);
    }

    getByactivesInventoryId(skip: number, pageSize: number, activesInventoryId: number, search: string) {
        const url = environment.apiUrl + '/api/valuationInActive' + '?skip=' + skip + '&pageSize=' + pageSize + '&activesInventoryId=' + activesInventoryId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/valuationInActive/' + id;
        return this.http.get(url);
    }

    insert(valuationInActive: ValuationInActive) {
        const url = environment.apiUrl + '/api/valuationInActive';
        return this.http.post(url, valuationInActive)
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

    update(valuationInActive: ValuationInActive) {
        const url = environment.apiUrl + '/api/valuationInActive/' + valuationInActive.valuationInActiveId;
        return this.http.put(url, valuationInActive)
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
        const url = environment.apiUrl + '/api/valuationInActive/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Valoración eliminada', 'La valoración se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

