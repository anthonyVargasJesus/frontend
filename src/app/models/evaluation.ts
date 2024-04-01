import { Standard } from "./standard";

export class Evaluation {
    constructor(
        public evaluationId?: string,
        public startDate?: Date,
        public endDate?: Date,
        public description?: string,
        public standardId?: number,
        public standard?: Standard,
    ) { }
}
