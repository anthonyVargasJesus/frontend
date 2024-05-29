import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Owner } from 'app/models/owner';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class OwnerService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/owner/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/owner' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/owner/' + id;
        return this.http.get(url);
    }

    insert(owner: Owner) {
        const url = environment.apiUrl + '/api/owner';
        return this.http.post(url, owner)
            .pipe(map((resp: any) => {
                Swal.fire('Owner registrado', 'El Owner se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(owner: Owner) {
        const url = environment.apiUrl + '/api/owner/' + owner.ownerId;
        return this.http.put(url, owner)
            .pipe(map((resp: any) => {
                Swal.fire('Owner actualizado', 'El Owner se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/owner/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Owner eliminado', 'El Owner se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

