
export class UserState {
    constructor(
        public _id?: string,
        public name?: string,
        public description?: string,
        public constant?: string,
        public value?: number,
        public deleted?: boolean,
        public created?: Date,
        public updated?: Date,
        public array?: string[]
    ) { }
}

