import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { BreachStatus } from 'app/models/breach-status';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class BreachStatusService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/breachStatus/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/breachStatus' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/breachStatus/' + id;
        return this.http.get(url);
    }

    insert(breachStatus: BreachStatus) {
        const url = environment.apiUrl + '/api/breachStatus';
        return this.http.post(url, breachStatus)
            .pipe(map((resp: any) => {
                Swal.fire('BreachStatus registrado', 'El BreachStatus se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(breachStatus: BreachStatus) {
        const url = environment.apiUrl + '/api/breachStatus/' + breachStatus.breachStatusId;
        return this.http.put(url, breachStatus)
            .pipe(map((resp: any) => {
                Swal.fire('BreachStatus actualizado', 'El BreachStatus se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/breachStatus/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('BreachStatus eliminado', 'El BreachStatus se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

