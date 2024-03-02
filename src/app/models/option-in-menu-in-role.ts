import { MenuInRole } from "./menu-in-role";
import { Option } from "./option";

export class OptionInMenuInRole {
    constructor(
        public _id?: string,
        public menuInRole?: MenuInRole,
        public option?: Option,
        public order?: number,
        public array?: string[]
    ) { }
}

