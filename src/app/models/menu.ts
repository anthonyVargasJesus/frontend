import { MenuInRole } from "./menu-in-role";
import { Option } from "./option";

export class Menu {
    constructor(
        public menuId?: Number,
        public name?: string,
        public image?: string,
        public menuInRole?: MenuInRole,
        public options?: Option[],
        public array?: string[]
    ) { }
}

