import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlImplementation } from 'app/models/control-implementation';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ControlImplementationService {

    constructor(public http: HttpClient) { }

    getByriskId(skip: number, pageSize: number, riskId: number, search: string) {
        const url = environment.apiUrl + '/api/controlImplementation' + '?skip=' + skip + '&pageSize=' + pageSize + '&riskId=' + riskId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/controlImplementation/' + id;
        return this.http.get(url);
    }

    insert(controlImplementation: ControlImplementation) {
        const url = environment.apiUrl + '/api/controlImplementation';
        return this.http.post(url, controlImplementation)
            .pipe(map((resp: any) => {
                Swal.fire('ControlImplementation registrado', 'El ControlImplementation se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(controlImplementation: ControlImplementation) {
        const url = environment.apiUrl + '/api/controlImplementation/' + controlImplementation.controlImplementationId;
        return this.http.put(url, controlImplementation)
            .pipe(map((resp: any) => {
                Swal.fire('ControlImplementation actualizado', 'El ControlImplementation se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/controlImplementation/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('ControlImplementation eliminado', 'El ControlImplementation se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

