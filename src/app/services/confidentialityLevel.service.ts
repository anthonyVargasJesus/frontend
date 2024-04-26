import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ConfidentialityLevel } from 'app/models/confidentiality-level';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ConfidentialityLevelService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/confidentialityLevel/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/confidentialityLevel' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/confidentialityLevel/' + id;
        return this.http.get(url);
    }

    insert(confidentialityLevel: ConfidentialityLevel) {
        const url = environment.apiUrl + '/api/confidentialityLevel';
        return this.http.post(url, confidentialityLevel)
            .pipe(map((resp: any) => {
                Swal.fire('Nivel de confidencialida registrado', 'El nivel de confidencialidad se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(confidentialityLevel: ConfidentialityLevel) {
        const url = environment.apiUrl + '/api/confidentialityLevel/' + confidentialityLevel.confidentialityLevelId;
        return this.http.put(url, confidentialityLevel)
            .pipe(map((resp: any) => {
                Swal.fire('Nivel de confidencialida actualizado', 'El nivel de confidencialidad se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: string) {
        const url = environment.apiUrl + '/api/confidentialityLevel/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Nivel de confidencialidad eliminado', 'El nivel de confidencialidad se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

