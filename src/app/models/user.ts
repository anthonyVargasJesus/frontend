import { Role } from "./role";
import { UserState } from "./user-state";

export class User {
    constructor(
        public userId?: number,
        public birthDate?: Date,
        public name?: string,
        public middleName?: string,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public document?: string,
        public website?: string,
        public phone?: string,
        public address?: string,
        public postalCode?: string,
        public city?: string,
        public userState?: UserState,
        public country?: string,
        public image?: string,
        public cantLogin?: boolean,
        public forceResetPassword?: boolean,
        public sex?: string,
        public position?: string,
        public area?: string,
        public uid?: string,
        public created?: Date,
        public updated?: Date,
        public deleted?: boolean,
        public token?: string,
        public color?: string,
        public roles?: Role[],
        public userStateId?: number,
        public documentNumber?: string,
    ) { }
}

