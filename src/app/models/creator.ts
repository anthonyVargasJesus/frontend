import { Personal } from "./personal";
import { Responsible } from "./responsible";

export class Creator {
    constructor(
        public creatorId?: number,
        public personalId?: number,
        public responsibleId?: number,
        public versionId?: number,
        public documentationId?: number,
        public personal?: Personal,
        public responsible?: Responsible,
    ) { }
}

