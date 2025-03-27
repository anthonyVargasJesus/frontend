import { Standard } from "./standard";
import { EvaluationState } from "./evaluation-state";

export class Evaluation {
    constructor(
        public evaluationId?: number,
        public startDate?: Date,
        public endDate?: Date,
        public description?: string,
        public standardId?: number,
        public standard?: Standard,
        public evaluationStateId?: number,
        public referenceEvaluationId?: number,
        public isGapAnalysis?: boolean,
        public isCurrent?: boolean,
        public evaluationState?: EvaluationState,
        public loadingExcel?: boolean,
    ) { }
}
