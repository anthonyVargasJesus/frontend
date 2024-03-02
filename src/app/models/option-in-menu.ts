import { Menu } from "./menu";
import { Option } from "./option";

export class OptionInMenu {
    constructor(
        public _id?: string,
        public menu?: Menu,
        public option?: Option,
        public array?: string[]
    ) { }
}

