import { Personal } from "./personal";
import { Responsible } from "./responsible";

export class Reviewer {
    constructor(
        public reviewerId?: number,
        public personalId?: number,
        public responsibleId?: number,
        public versionId?: number,
        public documentationId?: number,
        public companyId?: number,
        public personal?: Personal,
        public responsible?: Responsible,
    ) { }
}

