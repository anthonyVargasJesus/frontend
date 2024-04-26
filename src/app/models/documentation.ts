import { DocumentType } from "./document-type";
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
    ) { }
}
