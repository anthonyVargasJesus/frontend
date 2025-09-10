import { DefaultRisk } from "./default-risk";

export class ControlInDefaultRisk {
    constructor(
        public controlInDefaultRiskId?: number,
        public defaultRiskId?: number,
        public controlId?: number,
        public isActive?: boolean,
        public companyId?: number,
        public defaultRisk?: DefaultRisk,
    ) { }
}

