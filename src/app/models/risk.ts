import { ActivesInventory } from "./actives-inventory";
import { Evaluation } from "./evaluation";
import { Menace } from "./menace";
import { Vulnerability } from "./vulnerability";

export class Risk {
    constructor(
        public riskId?: number,
        public evaluationId?: number,
        public activesInventoryId?: number,
        public activesInventoryNumber?: string,
        public activesInventoryName?: string,
        public menaceId?: number,
        public vulnerabilityId?: number,
        public evaluation?: Evaluation,
        public activesInventory?: ActivesInventory,
        public menace?: Menace,
        public vulnerability?: Vulnerability,
    ) { }
}

