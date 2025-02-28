
export class Scope {
    constructor(
        public scopeId?: number,
        public isCurrent?: boolean,
        public date?: Date,
        public name?: string,
        public description?: string,
        public standardId?: number,
    ) { }
}

