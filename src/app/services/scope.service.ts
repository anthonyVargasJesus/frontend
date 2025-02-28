import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Scope } from 'app/models/scope';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ScopeService {

    constructor(public http: HttpClient) { }

    getAllBystandardId(standardId: number,) {
        const url = environment.apiUrl + '/api/scope/all?' + '&standardId=' + standardId;
        return this.http.get(url);
    }

    getBystandardId(skip: number, pageSize: number, standardId: number, search: string) {
        const url = environment.apiUrl + '/api/scope' + '?skip=' + skip + '&pageSize=' + pageSize + '&standardId=' + standardId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/scope/' + id;
        return this.http.get(url);
    }

    insert(scope: Scope) {
        const url = environment.apiUrl + '/api/scope';
        return this.http.post(url, scope)
            .pipe(map((resp: any) => {
                Swal.fire('Alcance registrado', 'El alcance se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(scope: Scope) {
        const url = environment.apiUrl + '/api/scope/' + scope.scopeId;
        return this.http.put(url, scope)
            .pipe(map((resp: any) => {
                Swal.fire('Alcance actualizado', 'El alcance se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/scope/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Alcance eliminado', 'El alcance se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

