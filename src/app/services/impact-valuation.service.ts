import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ImpactValuation } from 'app/models/impact-valuation';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})

export class ImpactValuationService {

    constructor(public http: HttpClient, private notificationService: NotificationService) { }

    getAll() {
        const url = environment.apiUrl + '/api/impactValuation/all';
        return this.http.get(url);
    }

    get(skip: number, pageSize: number, search: string) {
        const url = environment.apiUrl + '/api/impactValuation' + '?skip=' + skip + '&pageSize=' + pageSize + '&search=' + search;
        return this.http.get(url);
    }

    obtain(id: string) {
        const url = environment.apiUrl + '/api/impactValuation/' + id;
        return this.http.get(url);
    }

    insert(impactValuation: ImpactValuation) {
        const url = environment.apiUrl + '/api/impactValuation';
        return this.http.post(url, impactValuation)
            .pipe(map((resp: any) => {
                this.notificationService.showSuccess('¡Éxito!', 'La valoración se registró satisfactoriamente');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    update(impactValuation: ImpactValuation) {
        const url = environment.apiUrl + '/api/impactValuation/' + impactValuation.impactValuationId;
        return this.http.put(url, impactValuation)
            .pipe(map((resp: any) => {
                this.notificationService.showSuccess('¡Éxito!', 'La valoración se actualizó satisfactoriamente');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }

    delete(id: number) {
        const url = environment.apiUrl + '/api/impactValuation/' + id;
        return this.http.delete(url)
            .pipe(map((resp: any) => {
                this.notificationService.showSuccess('¡Éxito!', 'La valoración se eliminó satisfactoriamente');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

