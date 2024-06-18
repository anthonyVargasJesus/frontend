import { Role } from "./role";

export class RoleInUser {
    constructor(
        public roleInUserId?: number,
        public roleId?: number,
        public userId?: number,
        public role?: Role,
    ) { }
}

