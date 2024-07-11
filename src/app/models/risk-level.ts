
export class RiskLevel {
    constructor(
        public riskLevelId?: number,
        public name?: string,
        public description?: string,
        public abbreviation?: string,
        public factor?: number,
        public minimum?: number,
        public maximum?: number,
        public color?: string,
    ) { }
}

