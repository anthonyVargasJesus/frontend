import { ActivesInventory } from "./actives-inventory";
import { Control } from "./control";
import { ControlType } from "./control-type";
import { Menace } from "./menace";
import { Responsible } from "./responsible";
import { RiskLevel } from "./risk-level";
import { Vulnerability } from "./vulnerability";

export class Risk {
    constructor(
        public riskId?: number,
        public activesInventoryId?: number,
        public activesInventoryNumber?: string,
        public macroProcess?: string,
        public subProcess?: string,
        public activesInventoryName?: string,
        public activesInventoryValuation?: number,
        public menaceId?: number,
        public vulnerabilityId?: number,
        public menaceLevel?: number,
        public vulnerabilityLevel?: number,
        public controlId?: number,
        public riskAssessmentValue?: number,
        public riskLevelId?: number,
        public treatmentMethod?: string,
        public controlTypeId?: number,
        public controlsToImplement?: string,
        public menaceLevelWithTreatment?: number,
        public vulnerabilityLevelWithTreatment?: number,
        public riskAssessmentValueWithTreatment?: number,
        public riskLevelWithImplementedControlld?: number,
        public residualRisk?: string,
        public activities?: string,
        public implementationStartDate?: Date,
        public verificationDate?: Date,
        public responsibleId?: number,
        public observation?: string,
        public activesInventory?: ActivesInventory,
        public menace?: Menace,
        public vulnerability?: Vulnerability,
        public control?: Control,
        public riskLevel?: RiskLevel,
        public controlType?: ControlType,
        public responsible?: Responsible,
    ) { }
}

