import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Section } from 'app/models/section';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class SectionService {

    constructor(public http: HttpClient) { }

    getAll(versionId: number) {
        const url = environment.apiUrl + '/api/section/all' + '?versionId=' + versionId;
        return this.http.get(url);
    }

    getAllByDocumentationId(documentationId: number) {
        const url = environment.apiUrl + '/api/section/All-by-documentation' + '?documentationId=' + documentationId;
        return this.http.get(url);
    }

    getByDocumentationId(documentationId: number) {
        const url = environment.apiUrl + '/api/section/documentation' + '?documentationId=' + documentationId;
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string, versionId: number) {
        const url = environment.apiUrl + '/api/section' + '?skip=' + skip + '&pageSize=' + pageSize + '&versionId=' + versionId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/section/' + id;
        return this.http.get(url);
    }

    insert(section: Section) {
        const url = environment.apiUrl + '/api/section';
        return this.http.post(url, section)
            .pipe(map((resp: any) => {
                Swal.fire('Sección registrada', 'La sección se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(section: Section) {
        const url = environment.apiUrl + '/api/section/' + section.sectionId;
        return this.http.put(url, section)
            .pipe(map((resp: any) => {
                Swal.fire('Sección actualizada', 'La sección se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: string) {
        const url = environment.apiUrl + '/api/section/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Sección eliminada', 'La sección se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

