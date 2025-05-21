import { Risk } from "./risk";
import { RiskLevel } from "./risk-level";
import { RiskTreatmentMethod } from "./risk-treatment-method";

export class RiskTreatment {
    constructor(
        public riskTreatmentId?: number,
        public riskId?: number,
        public riskTreatmentMethodId?: number,
        public controlType?: string,
        public controlsToImplement?: string,
        public menaceLevelValue?: number,
        public vulnerabilityLevelValue?: number,
        public riskAssessmentValue?: number,
        public riskLevelId?: number,
        public residualRiskId?: number,
        public companyId?: number,
        public risk?: Risk,
        public riskTreatmentMethod?: RiskTreatmentMethod,
        public riskLevel?: RiskLevel,
    ) { }
}

