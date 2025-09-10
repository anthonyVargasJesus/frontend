import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Breach } from 'app/models/breach';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class BreachService {

    constructor(public http: HttpClient) { }

    getByevaluationId(skip: number, pageSize: number, evaluationId: number, search: string) {
        const url = environment.apiUrl + '/api/breach' + '?skip=' + skip + '&pageSize=' + pageSize + '&evaluationId=' + evaluationId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/breach/' + id;
        return this.http.get(url);
    }

    insert(breach: Breach) {
        const url = environment.apiUrl + '/api/breach';
        return this.http.post(url, breach)
            .pipe(map((resp: any) => {
                Swal.fire('Brecha registrada', 'La brecha se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(breach: Breach) {
        const url = environment.apiUrl + '/api/breach/' + breach.breachId;
        return this.http.put(url, breach)
            .pipe(map((resp: any) => {
                Swal.fire('Brecha actualizada', 'La brecha se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/breach/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Brecha eliminada', 'La brecha se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

