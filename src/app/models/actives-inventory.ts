import { ActiveType } from "./active-type";
import { Custodian } from "./custodian";
import { Location } from "./location";
import { Macroprocess } from "./macroprocess";
import { Owner } from "./owner";
import { Subprocess } from "./subprocess";
import { SupportType } from "./support-type";
import { UsageClassification } from "./usage-classification";

export class ActivesInventory {
    constructor(
        public activesInventoryId?: number,
        public number?: string,
        public macroprocessId?: number,
        public subprocessId?: number,
        public procedure?: string,
        public activeTypeId?: number,
        public name?: string,
        public description?: string,
        public ownerId?: number,
        public custodianId?: number,
        public usageClassificationId?: number,
        public supportTypeId?: number,
        public locationId?: number,
        public macroprocess?: Macroprocess,
        public subprocess?: Subprocess,
        public activeType?: ActiveType,
        public owner?: Owner,
        public custodian?: Custodian,
        public usageClassification?: UsageClassification,
        public supportType?: SupportType,
        public location?: Location,
    ) { }
}

