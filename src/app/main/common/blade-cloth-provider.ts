
export class BladeClothProvider {

    public static getSelectedClothes(plan) {
        let selectedClothes = [];
        plan.bodies.forEach(body => {
            body.cloths.forEach(cloth => {
                if (cloth.isBladeContainer) {
                    if (cloth.children)
                        cloth.children.forEach(child => {
                            if (child.isSelected)
                                selectedClothes.push(child);
                        })
                }
            });
        });
        return selectedClothes;
    }

    public static getTotalSelectedClothes(plan) {
        let counter = 0;
        plan.bodies.forEach(body => {
            body.cloths.forEach(cloth => {
                if (cloth.isBladeContainer) {
                    if (cloth.children)
                        cloth.children.forEach(child => {
                            if (child.isSelected)
                                counter++;
                        })
                }
            });
        });
        return counter;
    }

    public static clearSelectedClothes(plan) {
        plan.bodies.forEach(body => {
            body.cloths.forEach(cloth => {
                if (cloth.isBladeContainer) {
                    if (cloth.children)
                        cloth.children.forEach(child => {
                            if (child.isSelected)
                                child.isSelected = false;
                        })
                }
            });
        });
    }

}