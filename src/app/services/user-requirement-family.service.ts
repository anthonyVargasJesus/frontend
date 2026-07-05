import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class UserRequirementFamilyService {

  constructor(public http: HttpClient) { }

  get(userId: number, standardId: number) {
    const url = environment.apiUrl + '/api/userRequirementFamily?userId=' + userId + '&standardId=' + standardId;
    return this.http.get(url);
  }

  set(userId: number, standardId: number, requirementIds: number[]) {
    const url = environment.apiUrl + '/api/userRequirementFamily';
    return this.http.put(url, { userId, standardId, requirementIds })
      .pipe(map((resp: any) => {
        Swal.fire('Familias actualizadas', 'Las familias de cláusula asignadas se guardaron satisfactoriamente', 'success');
        return resp;
      }))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

}
