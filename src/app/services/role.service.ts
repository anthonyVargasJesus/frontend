import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Role } from 'app/models/role';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RoleService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/role/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/role' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/role/' + id;
        return this.http.get(url);
    }

    insert(role: Role) {
        const url = environment.apiUrl + '/api/role';
        return this.http.post(url, role)
            .pipe(map((resp: any) => {
                Swal.fire('Role registrado', 'El Role se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(role: Role) {
        const url = environment.apiUrl + '/api/role/' + role.roleId;
        return this.http.put(url, role)
            .pipe(map((resp: any) => {
                Swal.fire('Role actualizado', 'El Role se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/role/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Role eliminado', 'El Role se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

