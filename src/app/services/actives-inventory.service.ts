import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ActivesInventory } from 'app/models/actives-inventory';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ActivesInventoryService {

    constructor(public http: HttpClient) { }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/activesInventory' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/activesInventory/' + id;
        return this.http.get(url);
    }

    insert(activesInventory: ActivesInventory) {
        const url = environment.apiUrl + '/api/activesInventory';
        return this.http.post(url, activesInventory)
            .pipe(map((resp: any) => {
                Swal.fire('Activo registrado', 'El activo se registró satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(activesInventory: ActivesInventory) {
        const url = environment.apiUrl + '/api/activesInventory/' + activesInventory.activesInventoryId;
        return this.http.put(url, activesInventory)
            .pipe(map((resp: any) => {
                Swal.fire('Activo actualizado', 'El activo se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/activesInventory/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                Swal.fire('Activo eliminado', 'El activo se eliminó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

