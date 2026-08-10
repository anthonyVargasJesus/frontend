import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GapDashboardService {

    constructor(public http: HttpClient) { }

    // GET /api/gapDashboard/soa-report — mismo endpoint que usa la app móvil para la Declaración
    // de Aplicabilidad (SOA). Endpoint propio: no reutiliza /api/gap/evaluacion (trae también
    // requisitos/cláusulas y campos que el SOA no necesita) — solo controles del Anexo A,
    // siempre el catálogo completo del estándar (no filtrado por alcance del usuario).
    getSoaReport() {
        const url = environment.apiUrl + '/api/gapDashboard/soa-report';
        return this.http.get(url);
    }

    // GET /api/gapDashboard/bootstrap — mismo endpoint que usa la app móvil para "Inicio":
    // evaluación actual resuelta server-side + dashboard de cumplimiento + vista previa de
    // notificaciones, en una sola respuesta. A diferencia de /soa-report y /evaluacion, esta
    // NO viene envuelta en { data: ... } (ver comentario en el controller).
    getBootstrap(notificationsPageSize: number = 3) {
        const url = environment.apiUrl + '/api/gapDashboard/bootstrap?notificationsPageSize=' + notificationsPageSize;
        return this.http.get(url);
    }

}
