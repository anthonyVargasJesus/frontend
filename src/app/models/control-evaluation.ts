import { Evaluation } from "./evaluation";
import { MaturityLevel } from "./maturity-level";
import { ReferenceDocumentation } from "./reference-documentation";
import { Control } from "./control";
import { Responsible } from "./responsible";

export class ControlEvaluation {
    constructor(
        public controlEvaluationId?: number,
        public evaluationId?: number,
        public controlId?: number,
        public maturityLevelId?: number,
        public value?: number,
        public responsibleId?: number,
        public justification?: string,
        public improvementActions?: string,
        public standardId?: number,
        public companyId?: number,
        public evaluation?: Evaluation,
        public maturityLevel?: MaturityLevel,
        public responsible?: Responsible,
        public control?: Control,
        public referenceDocumentations?: ReferenceDocumentation[],
        public arrayReferenceDocumentations?: Number[],
        public controlType?: string,
        public controlDescription?: string,
        
    ) { }
}

