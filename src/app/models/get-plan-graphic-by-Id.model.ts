
export class GetGraphicByIdPlan {
    constructor(
        public planId?: string,
        public name?: string,
        public date?: Date,
        public bodies?: GetGraphicByIdBody[],
        public net?: GetGraphicByIdNet,
        public legend?: GetGraphicByIdPeriod[],
        public lastLegend?: GetGraphicByIdPeriod[],
        public leftHtmlHeights?: GetGraphicByIdHeight[],
        public rightHtmlHeights?: GetGraphicByIdHeight[],
        public materialTypesInTop?: GetGraphicByIdMaterialType[],
        public materialTypesInBottom?: GetGraphicByIdMaterialType[],
        public bodyGroups?: GetGraphicByIdBodyGroup[],
        public materialsSummary?: GetGraphicByIdClothMaterial[],
        public hasMesh?: boolean,
        public topRelingaText?: string,
        public topRelingaTotal?: number,
        public clothLenght?: number,
        public bottomRelingaText?: string,
        public bottomRelingaTotal?: number,
        public netHeight?: number,
        public clothStatesLegend?: GetGraphicByIdClothState[],
        public lastClothStatesLegend?: GetGraphicByIdClothState[],
        public meshHeight?: number
    ) { }
}

export class GetGraphicByIdBody {
    constructor(
        public bodyId?: number,
        public name?: string,
        public order?: number,
        public clothLength?: number,
        public bodyType?: GetGraphicByIdBodyType,
        public cloths?: GetGraphicByIdCloth[],
        public width?: number,
        public htmlWidth?: number,
        public floatsInBody?: GetGraphicByIdFloatInBody[],
        public group?: number,
        public initHeight?: number,
        public endingHeight?: number,
        public realHeight?: number,
        public materialTypesInTop?: GetGraphicByIdMaterialType[],
        public materialTypesInBottom?: GetGraphicByIdMaterialType[],
        public htmlEndingHeight?: number,
        public heightGuid?: string,
        public visible?: boolean,
        public first?: boolean,
    ) { }
}

export class GetGraphicByIdCloth {
    constructor(
        public clothId?: string,
        public name?: string,
        public body?: Body,
        public bodyId?: number,
        public clothMaterial?: GetGraphicByIdClothMaterial,
        public planId?: number,
        public clothGroup?: number,
        public clothOrder?: number,
        public height?: number,
        public referenceClothId?: number,
        public isContainer?: boolean,
        public isBladeContainer?: boolean,
        public isBlade?: boolean,
        public isPolygon?: boolean,
        public top?: number,
        public angle?: number,
        public excelHeight?: number,
        public color?: string,
        public hasBorderBottom?: boolean,
        public isPreviousMiddle?: boolean,
        public isMiddle?: boolean,
        public isNextMiddle?: boolean,
        public topPolygon?: number,
        public totalHeightPolygon?: number,
        public children?: GetGraphicByIdCloth[],
        public isSelected?: boolean,
        public netId?: number,
        public isLast?: boolean,
        public isLastBlade?: boolean,
        public hasPolygons?: boolean,
        public childrenClothGroups?: GetGraphicByIdChildrenClothGroup[],
        public width?: number,
        public referenceCloth?: GetGraphicByIdCloth,
        public lastColor?: string,
        public clothState?: GetGraphicByIdClothState,
        public stateColor?: string,
        public lastStateColor?: string,
    ) { }
}

export class GetGraphicByIdCapeGroup {
    constructor(
        public capeGroup?: number,
        public htmlWidth?: number,
        public isDiagonal?: boolean,
    ) { }
}


export class GetGraphicByIdClothState {
    constructor(
        public clothStateId?: number,
        public name?: string,
        public color?: string,
        public total?: number,
        public percent?: number,
    ) { }
}

export class GetGraphicByIdChildrenClothGroup {
    constructor(
        public left?: number,
        public width?: number,
        public previousMiddleText?: string,
        public middleText?: string,
        public nextMiddleText?: string,
    ) { }
}

export class GetGraphicByIdClothType {
    constructor(
        public clothTypeId?: string,
        public name?: string,
    ) { }
}

export class GetGraphicByIdBodyType {
    constructor(
        public bodyTypeId?: string,
        public name?: string,
        public value?: number,
        public order?: number,
    ) { }
}

export class GetGraphicByIdBodyGroup {
    constructor(
        public name?: string,
        public group?: number,
        public total?: number,
        public width?: number,
        public visible?: boolean,
        public bodyTypeValue?: number,
    ) { }
}

export class GetGraphicByIdNet {
    constructor(
        public netId?: number,
        public name?: string,
        public netType?: GetGraphicByIdNetType,
        public netSystem?: GetGraphicByIdNetSystem,
        public netModelo?: GetGraphicByIdNetModelo,
    ) { }
}

export class GetGraphicByIdNetModelo {
    constructor(
        public name?: string,
    ) { }
}

export class GetGraphicByIdNetSystem {
    constructor(
        public name?: string,
    ) { }
}

export class GetGraphicByIdNetType {
    constructor(
        public name?: string,
    ) { }
}

export class GetGraphicByIdPeriod {
    constructor(
        public periodId?: number,
        public year?: number,
        public number?: string,
        public beginning?: Date,
        public ending?: Date,
        public color?: string,
        public total?: number,
        public percent?: number,
    ) { }
}

export class GetGraphicByIdHeight {
    constructor(
        public heightId?: number,
        public name?: string,
        public heightOrder?: number,
        public leftBodyId?: number,
        public rightBodyId?: number,
        public heightBodyId?: number,
        public isInitHeight?: boolean,
        public toTheLeft?: boolean,
        public visible?: boolean,
        public lineHeight?: number,
        public bodyHeight?: number
    ) { }
}

export class GetGraphicByIdMaterialType {
    constructor(
        public materialTypeId?: string,
        public name?: string,
        public value?: number,
        public top?: boolean,
        public materialsInPlan?: GetGraphicByIdMaterialInPlan[],
        public totalMaterialsHeight?: number,
        public totalMaterialsInBody?: number,
        public totalRight?: number,
        public materialTypeInPlanId?: number
    ) { }

}

export class GetGraphicByIdMaterialInPlan {
    constructor(
        public materialInPlanId?: number,
        public clothMaterial?: GetGraphicByIdClothMaterial,
        public planId?: number,
        public excelHeight?: number,
        public total?: number,
        public materialTypeId?: number,
        public lastClothMaterialId?: number,
        public currentFloatInBody?: GetGraphicByIdFloatInBody,
        public totalRight?: number,
        public hasNoData?: boolean,
        public  name? :string,
        public materialTypeInPlanId?: number,
    ) { }
}

export class GetGraphicByIdFloatInBody {
    constructor(
        public floatInBodyId?: number,
        public quantity?: number,
        public clothMaterial?: GetGraphicByIdClothMaterial,
        public bodyId?: number,
        public planId?: number,
        public isChanged?: boolean,
        public isDeleted?: boolean,
        public clothMaterialId?: number,
        public materialInPlanId?: number,
        public hasChainInTop?: boolean,
        public hasChainInBottom?: boolean
    ) { }
}

export class GetGraphicByIdClothMaterial {
    constructor(
        public clothMaterialId?: string,
        public name?: string,
        public title?: string,
        public meshSize?: string,
        public meshHeight?: string,
        public clothType?: GetGraphicByIdClothType,
    ) { }
}




