import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

/**
 * GET /api/gap/evaluacion — mismo endpoint que usa la app móvil (Flutter) para esta misma
 * pantalla. Devuelve en una sola respuesta todo lo que "Análisis del GAP" necesita (evaluación,
 * niveles de madurez, responsables, requisitos con sus evaluaciones y grupos de controles con
 * las suyas), reemplazando las ~4 llamadas secuenciales que usaba el panel legacy
 * (EvaluationService.getCurrent + MaturityLevelService.getAll + RequirementEvaluationService +
 * ControlEvaluationService). Un solo punto de entrada compartido por ambos frontends: si el
 * backend cambia esta respuesta, tanto Angular como Flutter lo sienten igual.
 */
@Injectable({
    providedIn: 'root'
})
export class GapService {

    constructor(public http: HttpClient) { }

    getEvaluacionBootstrap() {
        const url = environment.apiUrl + '/api/gap/evaluacion';
        return this.http.get(url);
    }

    // GET /api/gap/resumen — header (%, mapa de brecha por tema, leyenda) de "Análisis del
    // GAP": números globales, no dependen de la búsqueda/filtro/página actual de getItems().
    getResumen(scopeToUser: boolean = true) {
        const url = environment.apiUrl + '/api/gap/resumen?scopeToUser=' + scopeToUser;
        return this.http.get(url);
    }

    // GET /api/gap/items — lista paginada de ítems (requisitos + controles) de la evaluación
    // actual, para el scroll infinito de gap-home. Reemplaza traer el árbol completo de
    // getEvaluacionBootstrap() para esa pantalla.
    getItems(skip: number, pageSize: number, search: string, theme: string, scopeToUser: boolean = true) {
        const url = environment.apiUrl + '/api/gap/items'
            + '?skip=' + skip + '&pageSize=' + pageSize
            + '&search=' + encodeURIComponent(search || '')
            + '&theme=' + encodeURIComponent(theme || '')
            + '&scopeToUser=' + scopeToUser;
        return this.http.get(url);
    }

    // GET /api/gap/plan-de-accion — mismo endpoint que usa la app móvil para la pantalla "Plan
    // de acción": evaluación, alcance liviano de ítems (tipo/itemId/maturityLevelId/theme, para
    // poder agrupar por tema sin traer el árbol completo), brechas y catálogos de acción
    // (estados/prioridades/usuarios), todo en una sola respuesta.
    getPlanDeAccionBootstrap(scopeToUser: boolean = true) {
        const url = environment.apiUrl + '/api/gap/plan-de-accion?scopeToUser=' + scopeToUser;
        return this.http.get(url);
    }

}
