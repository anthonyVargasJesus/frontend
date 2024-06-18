import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Menu } from 'app/models/menu';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class MenuService {

    constructor(public http: HttpClient) { }

    getByRoleId(roleId: number) {
        const url = environment.apiUrl + '/api/menu/Role' + '?roleId=' + roleId;
        return this.http.get(url);
    }

    getAll() {
        const url = environment.apiUrl + '/api/menu/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/menu' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/menu/' + id;
        return this.http.get(url);
    }

    insert(menu: Menu) {
        const url = environment.apiUrl + '/api/menu';
        return this.http.post(url, menu)
            .pipe(map((resp: any) => {
                Swal.fire('Menu registrado', 'El Menu se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(menu: Menu) {
        const url = environment.apiUrl + '/api/menu/' + menu.menuId;
        return this.http.put(url, menu)
            .pipe(map((resp: any) => {
                Swal.fire('Menu actualizado', 'El Menu se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: Number) {
        const url = environment.apiUrl + '/api/menu/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Menu eliminado', 'El Menu se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

