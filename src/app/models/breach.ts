import { BreachSeverity } from "./breach-severity";
import { BreachStatus } from "./breach-status";
import { Control } from "./control";
import { Requirement } from "./requirement";
import { Responsible } from "./responsible";

export class Breach {
    constructor(
        public breachId?: number,
        public evaluationId?: number,
        public standardId?: number,
        public type?: string,
        public requirementId?: number,
        public controlId?: number,
        public numerationToShow?: string,
        public title?: string,
        public description?: string,
        public breachSeverityId?: number,
        public breachStatusId?: number,
        public responsibleId?: number,
        public evidenceDescription?: string,
        public companyId?: number,
        public breachSeverity?: BreachSeverity,
        public breachStatus?: BreachStatus,
        public responsible?: Responsible,
        public requirement?: Requirement,
        public control?: Control,

    ) { }
}

