import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Policy } from 'app/models/policy';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class PolicyService {

    constructor(public http: HttpClient) { }

    getAllBystandardId(standardId: number,) {
        const url = environment.apiUrl + '/api/policy/all?' + '&standardId=' + standardId;
        return this.http.get(url);
    }

    getBystandardId(skip: number, pageSize: number, standardId: number, search: string) {
        const url = environment.apiUrl + '/api/policy' + '?skip=' + skip + '&pageSize=' + pageSize + '&standardId=' + standardId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/policy/' + id;
        return this.http.get(url);
    }

    insert(policy: Policy) {
        const url = environment.apiUrl + '/api/policy';
        return this.http.post(url, policy)
            .pipe(map((resp: any) => {
                Swal.fire('Política registrada', 'La política se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(policy: Policy) {
        const url = environment.apiUrl + '/api/policy/' + policy.policyId;
        return this.http.put(url, policy)
            .pipe(map((resp: any) => {
                Swal.fire('Política actualizada', 'La política se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/policy/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Política eliminada', 'La política se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

