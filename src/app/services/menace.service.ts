import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Menace } from 'app/models/menace';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class MenaceService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/menace/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/menace' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/menace/' + id;
        return this.http.get(url);
    }

    insert(menace: Menace) {
        const url = environment.apiUrl + '/api/menace';
        return this.http.post(url, menace)
            .pipe(map((resp: any) => {
                Swal.fire('Menace registrado', 'El Menace se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(menace: Menace) {
        const url = environment.apiUrl + '/api/menace/' + menace.menaceId;
        return this.http.put(url, menace)
            .pipe(map((resp: any) => {
                Swal.fire('Menace actualizado', 'El Menace se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/menace/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Menace eliminado', 'El Menace se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

