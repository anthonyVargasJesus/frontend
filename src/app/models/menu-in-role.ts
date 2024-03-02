import { Menu } from "./menu";
import { Role } from "./role";

export class MenuInRole {
    constructor(
        public _id?: string,
        public menu?: Menu,
        public role?: Role,
        public order?: number,
        public array?: string[]
    ) { }
}

