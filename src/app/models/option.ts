import { OptionInMenuInRole } from "./option-in-menu-in-role";

export class Option {
    constructor(
        public _id?: string,
        public name?: string,
        public image?: string,
        public url?: string,
        public isMobile?: boolean,
        public created?: Date,
        public updated?: Date,
        public deleted?: boolean,
        public isChecked?: boolean,
        public loading?: boolean,
        public optionInMenuInRole?: OptionInMenuInRole,
        public array?: string[],
        public order?: Number
    ) { }
}

