import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { RoleInUser } from 'app/models/role-in-user';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class RoleInUserService {

    constructor(public http: HttpClient) { }


    getByuserId(skip: number, pageSize: number, userId: number, search: string) {
        const url = environment.apiUrl + '/api/roleInUser' + '?skip=' + skip + '&pageSize=' + pageSize + '&userId=' + userId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/roleInUser/' + id;
        return this.http.get(url);
    }

    insert(roleInUser: RoleInUser) {
        const url = environment.apiUrl + '/api/roleInUser';
        return this.http.post(url, roleInUser)
            .pipe(map((resp: any) => {
                Swal.fire('RoleInUser registrado', 'El RoleInUser se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(roleInUser: RoleInUser) {
        const url = environment.apiUrl + '/api/roleInUser/' + roleInUser.roleInUserId;
        return this.http.put(url, roleInUser)
            .pipe(map((resp: any) => {
                Swal.fire('RoleInUser actualizado', 'El RoleInUser se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/roleInUser/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('RoleInUser eliminado', 'El RoleInUser se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

