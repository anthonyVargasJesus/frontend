import { Evaluation } from "./evaluation";
import { MaturityLevel } from "./maturity-level";
import { ReferenceDocumentation } from "./reference-documentation";
import { Requirement } from "./requirement";
import { Responsible } from "./responsible";

export class RequirementEvaluation {
    constructor(
        public requirementEvaluationId?: number,
        public evaluationId?: number,
        public requirementId?: number,
        public maturityLevelId?: number,
        public value?: number,
        public responsibleId?: number,
        public justification?: string,
        public improvementActions?: string,
        public standardId?: number,
        public companyId?: number,
        public evaluation?: Evaluation,
        public requirement?: Requirement,
        public maturityLevel?: MaturityLevel,
        public responsible?: Responsible,
        public referenceDocumentations?: ReferenceDocumentation[],
        public arrayReferenceDocumentations?: Number[],
        public state?: string,
        public percentage?: number,
        public auditorStatus?: number, // 1: Pendiente, 2: Aceptado, 3: Rechazado
        public auditorStatusText?: string, // 1: Pendiente, 2: Aceptado, 3: Rechazado
    ) { }
}

