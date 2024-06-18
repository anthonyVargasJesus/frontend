import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { OptionInMenuInRole } from 'app/models/option-in-menu-in-role';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class OptionInMenuInRoleService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/optionInMenuInRole/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number) {
        const url = environment.apiUrl + '/api/optionInMenuInRole' + '?skip=' + skip + '&pageSize=' + pageSize;
        return this.http.get(url);
    }

    search(search: string) {
        const url = environment.apiUrl + '/api/optionInMenuInRole/search/' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/optionInMenuInRole/' + id;
        return this.http.get(url);
    }

    insert(body: any) {
        const url = environment.apiUrl + '/api/optionInMenuInRole';
        return this.http.post(url, body)
            .pipe(map((resp: any) => {
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(optionInMenuInRole: OptionInMenuInRole) {
        const url = environment.apiUrl + '/api/optionInMenuInRole/' + optionInMenuInRole.optionInMenuInRoleId;
        return this.http.put(url, optionInMenuInRole)
            .pipe(map((resp: any) => {
                Swal.fire('Opción actualizada', 'La opción se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: string) {
        const url = environment.apiUrl + '/api/optionInMenuInRole/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

