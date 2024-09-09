import { Control } from "./control";
import { DocumentType } from "./document-type";
import { Requirement } from "./requirement";
import { Standard } from "./standard";

export class Documentation {
    constructor(
        public documentationId?: number,
        public name?: string,
        public description?: string,
        public template?: string,
        public documentTypeId?: number,
        public standardId?: number,
        public standard?: Standard[],
        public documentType?: DocumentType[],
        public requirements?: Requirement[],
        public controls?: Control[],
    ) { }
}
