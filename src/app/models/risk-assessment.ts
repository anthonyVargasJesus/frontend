import { Risk } from "./risk";
import { RiskLevel } from "./risk-level";

export class RiskAssessment {
    constructor(
        public riskAssessmentId?: number,
        public riskId?: number,
        public valuationCID?: number,
        public menaceLevelValue?: number,
        public vulnerabilityLevelValue?: number,
        public existingImplementedControls?: string,
        public riskAssessmentValue?: number,
        public riskLevelId?: number,
        public companyId?: number,
        public risk?: Risk,
        public riskLevel?: RiskLevel,
    ) { }
}

