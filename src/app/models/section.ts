import { Documentation } from "./documentation";
import { Version } from "./version";

export class Section {
    constructor(
        public sectionId?: number,
        public numeration?: number,
        public name?: string,
        public description?: string,
        public level?: number,
        public parentId?: number,
        public documentationId?: number,
        public versionId?: number,
        public section?: Section,
        public documentation?: Documentation,
        public version?: Version,
    ) { }
}

