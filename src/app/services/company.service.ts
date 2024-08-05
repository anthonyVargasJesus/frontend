import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Company } from 'app/models/company';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class CompanyService {

    constructor(public http: HttpClient) { }

   
    obtain(id: string) {
        const url = environment.apiUrl + '/api/company/' + id;
        return this.http.get(url);
    }


    update(company: Company) {
        const url = environment.apiUrl + '/api/company/' + company.companyId;
        return this.http.put(url, company)
            .pipe(map((resp: any) => {
                Swal.fire('Company actualizado', 'El Company se actualizó satisfactoriamente', 'success');
                return resp;
            }
            ))
            .pipe(catchError((error) => {
                ErrorManager.handleError(error);
                return throwError(error);
            }));
    }


}

