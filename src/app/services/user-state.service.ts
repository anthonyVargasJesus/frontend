import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { UserState } from 'app/models/user-state';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class UserStateService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/userState/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/userState' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/userState/' + id;
        return this.http.get(url);
    }

    insert(userState: UserState) {
        const url = environment.apiUrl + '/api/userState';
        return this.http.post(url, userState)
            .pipe(map((resp: any) => {
                Swal.fire('UserState registrado', 'El UserState se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(userState: UserState) {
        const url = environment.apiUrl + '/api/userState/' + userState.userStateId;
        return this.http.put(url, userState)
            .pipe(map((resp: any) => {
                Swal.fire('UserState actualizado', 'El UserState se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/userState/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('UserState eliminado', 'El UserState se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

