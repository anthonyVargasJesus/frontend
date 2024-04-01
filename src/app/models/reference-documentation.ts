import { Documentation } from "./documentation";

export class ReferenceDocumentation {
    constructor(
        public referenceDocumentationId?: number,
        public name?: string,
        public description?: string,
        public documentationId?: number,
        public requirementEvaluationId?: number,
        public controlEvaluationId?: number,
        public evaluationId?: number,
        public companyId?: number,
        public documentation?: Documentation,
    ) { }
}
