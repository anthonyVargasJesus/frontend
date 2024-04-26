
export class DefaultSection {
    constructor(
        public defaultSectionId?: number,
        public numeration?: number,
        public name?: string,
        public description?: string,
        public level?: number,
        public parentId?: number,
        public documentTypeId?: number,
        public documentType?: DocumentType,
        public numerationToShow?: string,
    ) { }
}

