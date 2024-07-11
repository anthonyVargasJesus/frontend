import { MenaceType } from "./menace-type";

export class Menace {
    constructor(
        public menaceId?: number,
        public menaceTypeId?: number,
        public name?: string,
        public menaceType?: MenaceType,
    ) { }
}

