import { ImpactValuation } from "./impact-valuation";

export class ValuationInActive {
    constructor(
        public valuationInActiveId?: number,
        public activesInventoryId?: number,
        public impactValuationId?: number,
        public value?: number,
        public impactValuation?: ImpactValuation,
    ) { }
}

