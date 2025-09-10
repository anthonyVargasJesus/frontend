import { Menace } from "./menace";
import { Vulnerability } from "./vulnerability";

export class DefaultRisk {
    constructor(
        public defaultRiskId?: number,
        public standardId?: number,
        public name?: string,
        public menaceId?: number,
        public vulnerabilityId?: number,
        public companyId?: number,
        public menace?: Menace,
        public vulnerability?: Vulnerability,
    ) { }
}

