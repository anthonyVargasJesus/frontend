import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Creator } from 'app/models/creator';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class CreatorService {

    constructor(public http: HttpClient) { }

    getAllByversionId(versionId: number,) {
        const url = environment.apiUrl + '/api/creator/all?' + 'versionId=' + versionId;
        return this.http.get(url);
    }

    getByversionId(skip: number, pageSize: number, versionId: number, search: string) {
        const url = environment.apiUrl + '/api/creator' + '?skip=' + skip + '&pageSize=' + pageSize + '&versionId=' + versionId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/creator/' + id;
        return this.http.get(url);
    }

    insert(creator: Creator) {
        const url = environment.apiUrl + '/api/creator';
        return this.http.post(url, creator)
            .pipe(map((resp: any) => {
                Swal.fire('Creator registrado', 'El Creator se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(creator: Creator) {
        const url = environment.apiUrl + '/api/creator/' + creator.creatorId;
        return this.http.put(url, creator)
            .pipe(map((resp: any) => {
                Swal.fire('Creator actualizado', 'El Creator se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/creator/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Creator eliminado', 'El Creator se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

