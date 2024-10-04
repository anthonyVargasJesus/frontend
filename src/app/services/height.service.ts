import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Height } from 'app/models/height';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class HeightService {

    constructor(public http: HttpClient) { }

    getAll(planId: number) {
        const url = environment.apiUrl + '/api/height/all?planId' + planId;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/height/' + id;
        return this.http.get(url);
    }

    insert(height: Height) {
        const url = environment.apiUrl + '/api/height';
        return this.http.post(url, height)
            .pipe(map((resp: any) => {
                Swal.fire('Altura registrada', 'La altura se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(height: Height) {
        const url = environment.apiUrl + '/api/height/' + height.heightId;
        return this.http.put(url, height)
            .pipe(map((resp: any) => {
                Swal.fire('Altura actualizada', 'La altura se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/height/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Altura eliminada', 'La altura se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

