
export class BodyProvider {

    public static getSelectedBodies(plan) {
        let selectedBodies = [];
        plan.bodies.forEach(body => {
            if (body.isSelected)
                selectedBodies.push(body.bodyId);

        });
        console.log('p', plan)
        return selectedBodies;
    }

    public static getTotalSelectedBodies(plan) {
        let counter = 0;
        plan.bodies.forEach(body => {
            if (body.isSelected)
                counter++;
        });
        return counter;
    }

    public static clearSelectedBodies(plan) {
        plan.bodies.forEach(body => {
            if (body.isSelected)
                body.isSelected = false;
        });
    }

}