import { MaturityLevel } from "./maturity-level";
import { RequirementEvaluation } from "./requirement-evaluation";
import { Responsible } from "./responsible";

export class Requirement {
    constructor(
        public requirementId?: number,
        public numeration?: number,
        public name?: string,
        public description?: string,
        public standardId?: number,
        public level?: number,
        public parentId?: number,
        public isEvaluable?: boolean,
        // Responsable sugerido para precargar el responsable de la evaluación la primera vez
        // que se evalúa este requisito en un ciclo nuevo (no reemplaza el de cada evaluación).
        public defaultResponsibleId?: number,
        public defaultResponsible?: Responsible,
        public children?: Requirement[],
        public parentNumeration?: number,
        public requirementEvaluations?: RequirementEvaluation[],
        public numerationToShow?: string,
        public value?: number,
        public letter?: string,
        public breadcrumbToShow?: string,
        public maturityLevels?: any[],
        public indicator?: any,
    ) { }
}
