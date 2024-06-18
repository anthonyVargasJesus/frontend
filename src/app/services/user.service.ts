import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { User } from 'app/models/user';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class UserService {

    constructor(public http: HttpClient) { }


    getAll() {
        const url = environment.apiUrl + '/api/user/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/user' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    search(search: string) {
        const url = environment.apiUrl + '/api/user/search/' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/user/' + id;
        return this.http.get(url);
    }

    insert(user: User) {
        const url = environment.apiUrl + '/api/user';
        return this.http.post(url, user)
            .pipe(map((resp: any) => {
                Swal.fire('Usuario registrado', 'El usuario se registró satisfactoriamente. <br> Lo siguiente es asignarle uno o varios roles', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(user: User) {
        const url = environment.apiUrl + '/api/user/' + user.userId;

        return this.http.put(url, user)
            .pipe(map((resp: any) => {
                Swal.fire('Usuario actualizado', 'El usuario se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: string) {
        const url = environment.apiUrl + '/api/user/' + id ;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Usuario actualizado', 'El usuario se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    getMenus(id: string) {
        const url = environment.apiUrl + '/api/user/menus/' + id;
        return this.http.get(url);
    }

    updateImage(user: User) {

        const url = environment.apiUrl + '/api/user/image/' + user.userId;

        return this.http.put(url, user)
            .pipe(map((resp: any) => {
                Swal.fire('Imgen subida', 'La imagen para ' + user.name + ' ' + user.firstName + ' fue subida.', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));

    }

}

