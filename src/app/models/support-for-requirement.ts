import { Documentation } from "./documentation";
import { Requirement } from "./requirement";

export class SupportForRequirement {
    constructor(
        public supportForRequirementId?: string,
        public documentationId?: number,
        public requirementId?: number,
        public standardId?: number,
        public documentation?: Documentation,
        public requirement?: Requirement,
    ) { }
}

