import { DefaultRisk } from "./default-risk";
import { Requirement } from "./requirement";

export class RequirementInDefaultRisk {
    constructor(
        public requirementInDefaultRiskId?: number,
        public defaultRiskId?: number,
        public requirementId?: number,
        public isActive?: boolean,
        public companyId?: number,
        public defaultRisk?: DefaultRisk,
        public requirement?: Requirement,
    ) { }
}

