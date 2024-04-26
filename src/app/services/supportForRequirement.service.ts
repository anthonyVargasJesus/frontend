import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { SupportForRequirement } from 'app/models/support-for-requirement';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class SupportForRequirementService {

    constructor(public http: HttpClient) { }

    get(skip: number, pageSize: number, search: string, documentationId: number) {
        const url = environment.apiUrl + '/api/supportForRequirement' + '?skip=' + skip + '&pageSize=' + pageSize + '&documentationId=' + documentationId + '&search=' + search ;
        return this.http.get(url);
      }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/supportForRequirement/' + id;
        return this.http.get(url);
    }

    insert(supportForRequirement: SupportForRequirement) {
        const url = environment.apiUrl + '/api/supportForRequirement';
        return this.http.post(url, supportForRequirement)
            .pipe(map((resp: any) => {
                Swal.fire('SupportForRequirement registrado', 'El SupportForRequirement se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(supportForRequirement: SupportForRequirement) {
        const url = environment.apiUrl + '/api/supportForRequirement/' + supportForRequirement.supportForRequirementId;
        return this.http.put(url, supportForRequirement)
            .pipe(map((resp: any) => {
                Swal.fire('SupportForRequirement actualizado', 'El SupportForRequirement se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: string) {
        const url = environment.apiUrl + '/api/supportForRequirement/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('SupportForRequirement eliminado', 'El SupportForRequirement se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

