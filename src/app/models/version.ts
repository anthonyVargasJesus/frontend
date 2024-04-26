import { ConfidentialityLevel } from "./confidentiality-level";
import { Documentation } from "./documentation";

export class Version {
    constructor(
        public versionId?: number,
        public number?: number,
        public code?: string,
        public name?: string,
        public confidentialityLevelId?: number,
        public documentationId?: number,
        public date?: Date,
        public isCurrent?: boolean,
        public fileName?: string,
        public description?: string,
        public standardId?: number,
        public confidentialityLevel?: ConfidentialityLevel,
        public documentation?: Documentation,
    ) { }
}

