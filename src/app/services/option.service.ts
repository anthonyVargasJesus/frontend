import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Option } from 'app/models/option';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class OptionService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/option/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/option' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/option/' + id;
        return this.http.get(url);
    }

    insert(option: Option) {
        const url = environment.apiUrl + '/api/option';
        return this.http.post(url, option)
            .pipe(map((resp: any) => {
                Swal.fire('Option registrado', 'El Option se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(option: Option) {
        const url = environment.apiUrl + '/api/option/' + option.optionId;
        return this.http.put(url, option)
            .pipe(map((resp: any) => {
                Swal.fire('Option actualizado', 'El Option se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: Number) {
        const url = environment.apiUrl + '/api/option/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Option eliminado', 'El Option se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

