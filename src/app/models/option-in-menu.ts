import { Menu } from "./menu";
import { Option } from "./option";

export class OptionInMenu {
    constructor(
        public optionInMenuId?: number,
        public menu?: Menu,
        public option?: Option,
        public menuId?: number,
        public optionId?: number,
        public order?: number,
    ) { }
}

