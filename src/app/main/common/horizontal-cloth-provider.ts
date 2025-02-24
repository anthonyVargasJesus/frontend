
export class HorizontalClothProvider {

    public static getSelectedClothes(plan) {
        let selectedClothes = [];
        plan.bodies.forEach(body => {
            body.cloths.forEach(cloth => {
                if (cloth.isSelected)
                    selectedClothes.push(cloth);
            });
        });
        return selectedClothes;
    }

    public static getTotalSelectedClothes(plan) {
        let counter = 0;
        plan.bodies.forEach(body => {
            body.cloths.forEach(cloth => {
                if (cloth.isSelected)
                    counter++;
            });
        });
        return counter;
    }

    public static clearSelectedClothes(plan) {
        plan.bodies.forEach(body => {
            body.cloths.forEach(cloth => {
                if (cloth.isSelected)
                    cloth.isSelected = false;
            });
        });
    }
    

}