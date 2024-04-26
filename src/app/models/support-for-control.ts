import { Documentation } from "./documentation";
import { Control } from "./control";

export class SupportForControl {
    constructor(
        public supportForControlId?: number,
        public documentationId?: number,
        public controlId?: number,
        public standardId?: number,
        public documentation?: Documentation,
        public control?: Control,
    ) { }
}

