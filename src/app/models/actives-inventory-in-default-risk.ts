import { ActivesInventory } from "./actives-inventory";

export class ActivesInventoryInDefaultRisk {
    constructor(
        public activesInventoryInDefaultRiskId?: number,
        public defaultRiskId?: number,
        public activesInventoryId?: number,
        public isActive?: boolean,
        public companyId?: number,
        public activesInventory?: ActivesInventory,
    ) { }
}

