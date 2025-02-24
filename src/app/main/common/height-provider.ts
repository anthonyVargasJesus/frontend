
export class HeightProvider {

    public static manageHeights(htmlHeights: any, bodyIds:number[]) {

        htmlHeights.forEach(height => {
                height.isVisible = false;
        });

        bodyIds.forEach(bodyId =>{
            htmlHeights.forEach(height => {
                if (height.bodyId == bodyId)
                    height.isVisible = true;
            });
        });

    }



}