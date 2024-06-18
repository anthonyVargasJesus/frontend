import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { OptionInMenu } from 'app/models/option-in-menu';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class OptionInMenuService {

    constructor(public http: HttpClient) { }

    getBymenuId(skip: number, pageSize: number, menuId: number, search: string) {
        const url = environment.apiUrl + '/api/optionInMenu' + '?skip=' + skip + '&pageSize=' + pageSize + '&menuId=' + menuId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/optionInMenu/' + id;
        return this.http.get(url);
    }

    insert(optionInMenu: OptionInMenu) {
        const url = environment.apiUrl + '/api/optionInMenu';
        return this.http.post(url, optionInMenu)
            .pipe(map((resp: any) => {
                Swal.fire('OptionInMenu registrado', 'El OptionInMenu se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(optionInMenu: OptionInMenu) {
        const url = environment.apiUrl + '/api/optionInMenu/' + optionInMenu.optionInMenuId;
        return this.http.put(url, optionInMenu)
            .pipe(map((resp: any) => {
                Swal.fire('OptionInMenu actualizado', 'El OptionInMenu se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/optionInMenu/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('OptionInMenu eliminado', 'El OptionInMenu se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

