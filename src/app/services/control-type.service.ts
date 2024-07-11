import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlType } from 'app/models/control-type';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ControlTypeService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/controlType/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/controlType' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/controlType/' + id;
        return this.http.get(url);
    }

    insert(controlType: ControlType) {
        const url = environment.apiUrl + '/api/controlType';
        return this.http.post(url, controlType)
            .pipe(map((resp: any) => {
                Swal.fire('ControlType registrado', 'El ControlType se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(controlType: ControlType) {
        const url = environment.apiUrl + '/api/controlType/' + controlType.controlTypeId;
        return this.http.put(url, controlType)
            .pipe(map((resp: any) => {
                Swal.fire('ControlType actualizado', 'El ControlType se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/controlType/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('ControlType eliminado', 'El ControlType se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

