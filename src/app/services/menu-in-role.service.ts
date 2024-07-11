import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { MenuInRole } from 'app/models/menu-in-role';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class MenuInRoleService {

    constructor(public http: HttpClient) { }

    getAllByroleId(roleId: number,) {
        const url = environment.apiUrl + '/api/menuInRole/all/role?' + '&roleId=' + roleId;
        return this.http.get(url);
    }

    getByroleId(skip: number, pageSize: number, roleId: number) {
        const url = environment.apiUrl + '/api/menuInRole/role' + '?skip=' + skip + '&pageSize=' + pageSize + '&roleId=' + roleId;
        return this.http.get(url);
    }

    searchByroleId(search: string, roleId: number) {
        const url = environment.apiUrl + '/api/menuInRole/search/' + search + '&roleId=' + roleId;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/menuInRole/' + id;
        return this.http.get(url);
    }

    insert2(body: any) {
        const url = environment.apiUrl + '/api/menuInRole';
        return this.http.post(url, body)
            .pipe(map((resp: any) => {
                Swal.fire('Menú registrado', 'El menú se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(menuInRole: MenuInRole) {
        const url = environment.apiUrl + '/api/menuInRole/' + menuInRole._id;
        return this.http.put(url, menuInRole)
            .pipe(map((resp: any) => {
                Swal.fire('Menú actualizado', 'El menú se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: string, unsubscribe: boolean) {
        const url = environment.apiUrl + '/api/menuInRole/' + id + '/' + unsubscribe;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Menú actualizado', 'El menú se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

