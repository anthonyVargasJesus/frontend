import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Location } from 'app/models/location';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class LocationService {

    constructor(public http: HttpClient) { }

    getAll() {
        const url = environment.apiUrl + '/api/location/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/location' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/location/' + id;
        return this.http.get(url);
    }

    insert(location: Location) {
        const url = environment.apiUrl + '/api/location';
        return this.http.post(url, location)
            .pipe(map((resp: any) => {
                Swal.fire('Location registrado', 'El Location se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(location: Location) {
        const url = environment.apiUrl + '/api/location/' + location.locationId;
        return this.http.put(url, location)
            .pipe(map((resp: any) => {
                Swal.fire('Location actualizado', 'El Location se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/location/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Location eliminado', 'El Location se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

