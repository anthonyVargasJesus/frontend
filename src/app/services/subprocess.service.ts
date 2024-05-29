import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Subprocess } from 'app/models/subprocess';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class SubprocessService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/subprocess/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/subprocess' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/subprocess/' + id;
        return this.http.get(url);
    }

    insert(subprocess: Subprocess) {
        const url = environment.apiUrl + '/api/subprocess';
        return this.http.post(url, subprocess)
            .pipe(map((resp: any) => {
                Swal.fire('Subproceso registrado', 'El subproceso se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(subprocess: Subprocess) {
        const url = environment.apiUrl + '/api/subprocess/' + subprocess.subprocessId;
        return this.http.put(url, subprocess)
            .pipe(map((resp: any) => {
                Swal.fire('Subproceso actualizado', 'El subproceso se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/subprocess/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Subproceso eliminado', 'El subproceso se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

