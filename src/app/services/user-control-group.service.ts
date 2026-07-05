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

export class UserControlGroupService {

  constructor(public http: HttpClient) { }

  get(userId: number, standardId: number) {
    const url = environment.apiUrl + '/api/userControlGroup?userId=' + userId + '&standardId=' + standardId;
    return this.http.get(url);
  }

  set(userId: number, standardId: number, controlGroupIds: number[]) {
    const url = environment.apiUrl + '/api/userControlGroup';
    return this.http.put(url, { userId, standardId, controlGroupIds })
      .pipe(map((resp: any) => {
        Swal.fire('Grupos actualizados', 'Los grupos de control asignados se guardaron satisfactoriamente', 'success');
        return resp;
      }))
      .pipe(catchError((error) => {
        ErrorManager.handleError(error);
        return throwError(error);
      }));
  }

}
