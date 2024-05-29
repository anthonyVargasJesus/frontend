import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { UsageClassification } from 'app/models/usage-classification';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class UsageClassificationService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/usageClassification/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/usageClassification' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/usageClassification/' + id;
        return this.http.get(url);
    }

    insert(usageClassification: UsageClassification) {
        const url = environment.apiUrl + '/api/usageClassification';
        return this.http.post(url, usageClassification)
            .pipe(map((resp: any) => {
                Swal.fire('UsageClassification registrado', 'El UsageClassification se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(usageClassification: UsageClassification) {
        const url = environment.apiUrl + '/api/usageClassification/' + usageClassification.usageClassificationId;
        return this.http.put(url, usageClassification)
            .pipe(map((resp: any) => {
                Swal.fire('UsageClassification actualizado', 'El UsageClassification se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/usageClassification/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('UsageClassification eliminado', 'El UsageClassification se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

