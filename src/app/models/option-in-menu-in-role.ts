import { MenuInRole } from "./menu-in-role";
import { Option } from "./option";

export class OptionInMenuInRole {
    constructor(
        public optionInMenuInRoleId?: number,
        public menuInRole?: MenuInRole,
        public option?: Option,
        public order?: number,
        public array?: string[]
    ) { }
}

