import { MaturityLevel } from "./maturity-level";
import { RequirementEvaluation } from "./requirement-evaluation";

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
