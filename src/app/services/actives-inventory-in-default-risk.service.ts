import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ActivesInventoryInDefaultRisk } from 'app/models/actives-inventory-in-default-risk';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ActivesInventoryInDefaultRiskService {

    constructor(public http: HttpClient) { }

    getBydefaultRiskId(skip: number, pageSize: number, defaultRiskId: number, search: string) {
        const url = environment.apiUrl + '/api/activesInventoryInDefaultRisk' + '?skip=' + skip + '&pageSize=' + pageSize + '&defaultRiskId=' + defaultRiskId + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/activesInventoryInDefaultRisk/' + id;
        return this.http.get(url);
    }

    insert(activesInventoryInDefaultRisk: ActivesInventoryInDefaultRisk) {
        const url = environment.apiUrl + '/api/activesInventoryInDefaultRisk';
        return this.http.post(url, activesInventoryInDefaultRisk)
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

    update(activesInventoryInDefaultRisk: ActivesInventoryInDefaultRisk) {
        const url = environment.apiUrl + '/api/activesInventoryInDefaultRisk/' + activesInventoryInDefaultRisk.activesInventoryInDefaultRiskId;
        return this.http.put(url, activesInventoryInDefaultRisk)
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
        const url = environment.apiUrl + '/api/activesInventoryInDefaultRisk/' + id;
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

