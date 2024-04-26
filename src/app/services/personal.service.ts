import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Personal } from 'app/models/personal';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class PersonalService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/personal/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/personal' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/personal/' + id;
        return this.http.get(url);
    }

    insert(personal: Personal) {
        const url = environment.apiUrl + '/api/personal';
        return this.http.post(url, personal)
            .pipe(map((resp: any) => {
                Swal.fire('Personal registrado', 'El Personal se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(personal: Personal) {
        const url = environment.apiUrl + '/api/personal/' + personal.personalId;
        return this.http.put(url, personal)
            .pipe(map((resp: any) => {
                Swal.fire('Personal actualizado', 'El Personal se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: Number) {
        const url = environment.apiUrl + '/api/personal/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Personal eliminado', 'El Personal se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

