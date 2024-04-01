
export class Indicator {
    constructor(
        public indicatorId?: number,
        public name?: string,
        public description?: string,
        public abbreviation?: string,
        public value?: number,
        public minimum?: number,
        public maximum?: number,
        public color?: string,
        public array?: string[],
    ) { }
}
