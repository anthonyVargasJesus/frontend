import { Responsible } from "./responsible";
import { Risk } from "./risk";

export class ControlImplementation {
    constructor(
        public controlImplementationId?: number,
        public riskId?: number,
        public activities?: string,
        public startDate?: Date,
        public verificationDate?: Date,
        public responsibleId?: number,
        public observation?: string,
        public companyId?: number,
        public risk?: Risk,
        public responsible?: Responsible,
        public isImplemented?: boolean,
        public isEffective?: boolean,
    ) { }
}

