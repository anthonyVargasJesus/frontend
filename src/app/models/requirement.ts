
export class Requirement {
    constructor(
        public requirementId?: string,
        public numeration?: number,
        public name?: string,
        public description?: string,
        public standardId?: number,
        public level?: number,
        public parentId?: number,
        public isEvaluable?: boolean,
    ) { }
}
