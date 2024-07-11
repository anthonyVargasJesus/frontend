import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { MenaceType } from 'app/models/menace-type';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class MenaceTypeService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/menaceType/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/menaceType' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/menaceType/' + id;
        return this.http.get(url);
    }

    insert(menaceType: MenaceType) {
        const url = environment.apiUrl + '/api/menaceType';
        return this.http.post(url, menaceType)
            .pipe(map((resp: any) => {
                Swal.fire('MenaceType registrado', 'El MenaceType se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(menaceType: MenaceType) {
        const url = environment.apiUrl + '/api/menaceType/' + menaceType.menaceTypeId;
        return this.http.put(url, menaceType)
            .pipe(map((resp: any) => {
                Swal.fire('MenaceType actualizado', 'El MenaceType se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/menaceType/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('MenaceType eliminado', 'El MenaceType se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

