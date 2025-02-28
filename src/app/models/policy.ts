
export class Policy {
    constructor(
        public policyId?: number,
        public isCurrent?: boolean,
        public date?: Date,
        public name?: string,
        public description?: string,
        public standardId?: number,
    ) { }
}

