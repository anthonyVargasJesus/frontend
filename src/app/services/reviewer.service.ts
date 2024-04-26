import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Reviewer } from 'app/models/reviewer';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ReviewerService {

    constructor(public http: HttpClient) { }

    getAllByversionId(versionId: number,) {
        const url = environment.apiUrl + '/api/reviewer/all?' + '&versionId=' + versionId;
        return this.http.get(url);
    }

    getByversionId(skip: number, pageSize: number, versionId: number, search: string) {
        const url = environment.apiUrl + '/api/reviewer' + '?skip=' + skip + '&pageSize=' + pageSize + '&versionId=' + versionId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/reviewer/' + id;
        return this.http.get(url);
    }

    insert(reviewer: Reviewer) {
        const url = environment.apiUrl + '/api/reviewer';
        return this.http.post(url, reviewer)
            .pipe(map((resp: any) => {
                Swal.fire('Reviewer registrado', 'El Reviewer se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(reviewer: Reviewer) {
        const url = environment.apiUrl + '/api/reviewer/' + reviewer.reviewerId;
        return this.http.put(url, reviewer)
            .pipe(map((resp: any) => {
                Swal.fire('Reviewer actualizado', 'El Reviewer se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/reviewer/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Reviewer eliminado', 'El Reviewer se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

