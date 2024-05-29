import { Macroprocess } from "./macroprocess";

export class Subprocess {
    constructor(
        public subprocessId?: number,
        public code?: string,
        public name?: string,
        public macroprocessId?: number,
        public macroprocess?: Macroprocess,
    ) { }
}

