
export class ActionPlan {
    constructor(
        public actionPlanId?: number,
        public breachId?: number,
        public evaluationId?: number,
        public standardId?: number,
        public title?: string,
        public description?: string,
        public userId?: number,
        public startDate?: Date,
        public dueDate?: Date,
        public actionPlanStatusId?: number,
        public actionPlanPriorityId?: number,
        public user?: { name?: string },
    ) { }
}

