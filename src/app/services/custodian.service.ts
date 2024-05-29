import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Custodian } from 'app/models/custodian';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class CustodianService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/custodian/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/custodian' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/custodian/' + id;
        return this.http.get(url);
    }

    insert(custodian: Custodian) {
        const url = environment.apiUrl + '/api/custodian';
        return this.http.post(url, custodian)
            .pipe(map((resp: any) => {
                Swal.fire('Custodian registrado', 'El Custodian se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(custodian: Custodian) {
        const url = environment.apiUrl + '/api/custodian/' + custodian.custodianId;
        return this.http.put(url, custodian)
            .pipe(map((resp: any) => {
                Swal.fire('Custodian actualizado', 'El Custodian se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/custodian/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Custodian eliminado', 'El Custodian se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

