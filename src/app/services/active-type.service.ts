import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ActiveType } from 'app/models/active-type';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ActiveTypeService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/activeType/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/activeType' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/activeType/' + id;
        return this.http.get(url);
    }

    insert(activeType: ActiveType) {
        const url = environment.apiUrl + '/api/activeType';
        return this.http.post(url, activeType)
            .pipe(map((resp: any) => {
                Swal.fire('Tipo registrado', 'El tipo se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(activeType: ActiveType) {
        const url = environment.apiUrl + '/api/activeType/' + activeType.activeTypeId;
        return this.http.put(url, activeType)
            .pipe(map((resp: any) => {
                Swal.fire('Tipo actualizado', 'El tipo se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/activeType/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Tipo eliminado', 'El tipo se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

