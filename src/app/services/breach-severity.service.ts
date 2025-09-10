import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { BreachSeverity } from 'app/models/breach-severity';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class BreachSeverityService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/breachSeverity/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/breachSeverity' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/breachSeverity/' + id;
        return this.http.get(url);
    }

    insert(breachSeverity: BreachSeverity) {
        const url = environment.apiUrl + '/api/breachSeverity';
        return this.http.post(url, breachSeverity)
            .pipe(map((resp: any) => {
                Swal.fire('BreachSeverity registrado', 'El BreachSeverity se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(breachSeverity: BreachSeverity) {
        const url = environment.apiUrl + '/api/breachSeverity/' + breachSeverity.breachSeverityId;
        return this.http.put(url, breachSeverity)
            .pipe(map((resp: any) => {
                Swal.fire('BreachSeverity actualizado', 'El BreachSeverity se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/breachSeverity/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('BreachSeverity eliminado', 'El BreachSeverity se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

