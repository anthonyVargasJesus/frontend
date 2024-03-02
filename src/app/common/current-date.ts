
export class CurrentDateManager {

    public static getCurrentDate() {

        let now = new Date().toLocaleString();
        var array = now.split(' ');  

        let currentDay = '';
        if (array.length>0)
            currentDay = array[0];

         let currentHour = '';
         if (array.length>1)
         currentHour = array[1];

         let currentDate = {
            'day': currentDay,
            'hour': currentHour
         }

        return currentDate;
    }


    public static getDateWithSlash(date) {

        let now = date.toLocaleString();
        var array = now.split(' ');  

        let currentDay = '';
        if (array.length>0)
            currentDay = array[0];

         let currentHour = '';
         if (array.length>1)
         currentHour = array[1];

         let currentDate = {
            'day': currentDay,
            'hour': currentHour
         }

        return currentDate;
    }

    public static isValidDate(strDate) {

           if (Date.parse(strDate))
            return true

        return false;
    }

  }