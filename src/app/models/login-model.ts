import { Role } from "./role";

export class LoginModel {

    constructor(
        public _id?: string,
        public fn?: string,
        public em?: string,
        public img?: string,
        public g?: boolean,
        public ctl?: string,
        public frp?: string,
        public sx?: string,
        public dcd?: string,
        public tk?: string,
        public tr?: number,
        public pst?: string,
        public rls?: Role[],
        public isd?: boolean,
        public cr?: string,
        public cmy?: string,
    ) { }

}
