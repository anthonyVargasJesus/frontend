import { Responsible } from "./responsible";

export class Control {
    constructor(
        public controlId?: number,
        public number?: number,
        public name?: string,
        public description?: string,
        public controlGroupId?: number,
        public standardId?: number,
        public numerationToShow?: string,
        // Responsable sugerido para precargar el responsable de la evaluación la primera vez
        // que se evalúa este control en un ciclo nuevo (no reemplaza el de cada evaluación).
        public defaultResponsibleId?: number,
        public defaultResponsible?: Responsible,

    ) { }
}
