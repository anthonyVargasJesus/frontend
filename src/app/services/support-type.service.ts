import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { SupportType } from 'app/models/support-type';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class SupportTypeService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/supportType/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/supportType' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/supportType/' + id;
        return this.http.get(url);
    }

    insert(supportType: SupportType) {
        const url = environment.apiUrl + '/api/supportType';
        return this.http.post(url, supportType)
            .pipe(map((resp: any) => {
                Swal.fire('SupportType registrado', 'El SupportType se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(supportType: SupportType) {
        const url = environment.apiUrl + '/api/supportType/' + supportType.supportTypeId;
        return this.http.put(url, supportType)
            .pipe(map((resp: any) => {
                Swal.fire('SupportType actualizado', 'El SupportType se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/supportType/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('SupportType eliminado', 'El SupportType se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

