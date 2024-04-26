import { Personal } from "./personal";
import { Responsible } from "./responsible";

export class Approver {
    constructor(
        public approverId?: number,
        public personalId?: number,
        public responsibleId?: number,
        public versionId?: number,
        public documentationId?: number,
        public companyId?: number,
        public personal?: Personal,
        public responsible?: Responsible,
    ) { }
}

