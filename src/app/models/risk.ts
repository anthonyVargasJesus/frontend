import { ActivesInventory } from "./actives-inventory";
import { Evaluation } from "./evaluation";
import { Menace } from "./menace";
import { Vulnerability } from "./vulnerability";

export class Risk {
    constructor(
        public riskId?: number,
        public evaluationId?: number,
        public activesInventoryId?: number,
        public name?: string,
        public activesInventoryNumber?: string,
        public activesInventoryName?: string,
        public menaceId?: number,
        public vulnerabilityId?: number,
        public evaluation?: Evaluation,
        public activesInventory?: ActivesInventory,
        public menace?: Menace,
        public vulnerability?: Vulnerability,
        public riskAssessmentId?: number,
        public valuationCID?: number,
        public riskTreatmentId?: number,
        public controlImplementationId?: number,
        public breachId?: number,
        public initialRiskValue?: number,
        public initialRiskLevel?: string,
        public initialRiskColor?: string,
        public treatedRiskValue?: number,
        public treatedRiskLevel?: string,
        public treatedRiskColor?: string,
        public residualRiskValue?: number,
        public residualRiskLevel?: string,
        public residualRiskColor?: string,
        public plannedControls?: number,
        public effectiveControls?: number,
        public controlSummary?: string,
        public trend?: string,
        public trendIcon?: string,
    ) { }
}

