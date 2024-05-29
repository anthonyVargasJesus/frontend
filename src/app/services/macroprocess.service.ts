import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Macroprocess } from 'app/models/macroprocess';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class MacroprocessService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/macroprocess/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/macroprocess' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/macroprocess/' + id;
        return this.http.get(url);
    }

    insert(macroprocess: Macroprocess) {
        const url = environment.apiUrl + '/api/macroprocess';
        return this.http.post(url, macroprocess)
            .pipe(map((resp: any) => {
                Swal.fire('Macroproceso registrado', 'El macroproceso se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(macroprocess: Macroprocess) {
        const url = environment.apiUrl + '/api/macroprocess/' + macroprocess.macroprocessId;
        return this.http.put(url, macroprocess)
            .pipe(map((resp: any) => {
                Swal.fire('Macroproceso actualizado', 'El macroproceso se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/macroprocess/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Macroproceso eliminado', 'El macroproceso se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

