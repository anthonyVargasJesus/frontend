import { Session } from "app/models/session";

export class EventStorageManager {

    public static SESSION_ARRAY_KEY = 'events';

    public static saveEventInLocal(session: Session) {

        if (this.existsInStorage(this.SESSION_ARRAY_KEY)) {
            let getEvents = JSON.parse(localStorage.getItem(this.SESSION_ARRAY_KEY));
            getEvents.push(session);
            localStorage.removeItem(this.SESSION_ARRAY_KEY);
            localStorage.setItem(this.SESSION_ARRAY_KEY, JSON.stringify(getEvents))
        } else {
            let getEvents = [];
            getEvents.push(session);
            localStorage.setItem(this.SESSION_ARRAY_KEY, JSON.stringify(getEvents));
        }
    }

    public static updateSessionToStorage(session2: Session) {

        let storageEvents = [];
        const SESSION_ARRAY_KEY = 'events';
        if (this.existsInStorage(SESSION_ARRAY_KEY))
            storageEvents = JSON.parse(localStorage.getItem(SESSION_ARRAY_KEY));

        let events2 = []
        storageEvents.forEach(item => {

            if (item.localId.toString() == session2.localId.toString()) {
                //item = session2;

                //
                item.sessionNumber = session2.sessionNumber;
                //item.sessionNumberShow = session2.sessionNumberShow;
                item.startDate = session2.startDate;
                item.endDate = session2.endDate;
                //item.startDateShow = session2.startDateShow;
                item.patient = session2.patient;
                //item.frecuency = session2.frecuency;
                //item.therapist = session2.therapist;
                //item.service = session2.service;
                item.observation = session2.observation;
                item.legend = session2.legend;
                item.localId = session2.localId;
                item.therapy = session2.therapy;
            }

            events2.push(item);

        });

        localStorage.setItem(SESSION_ARRAY_KEY, JSON.stringify(events2))
    }

    public static deleteSessionToStorage(localId: string) {

        let storageEvents = [];
        const SESSION_ARRAY_KEY = 'events';
        if (this.existsInStorage(SESSION_ARRAY_KEY))
            storageEvents = JSON.parse(localStorage.getItem(SESSION_ARRAY_KEY));

        let events2 = []
        storageEvents.forEach(item => {

            if (item.localId.toString() != localId) {
                events2.push(item);;
            }
        });

        localStorage.setItem(SESSION_ARRAY_KEY, JSON.stringify(events2))
    }

    public static obtainSessionFromStorage(id: string) {

        let storageEvents = [];
        if (this.existsInStorage(this.SESSION_ARRAY_KEY))
            storageEvents = JSON.parse(localStorage.getItem(this.SESSION_ARRAY_KEY));

        let currentSession;
        storageEvents.forEach(item => {
            if (item.localId.toString() == id.toString())
                currentSession = item;
        });

        return currentSession;
    }


    public static existsInStorage(KEY: string) {
        if (localStorage.getItem(KEY))
            return true;
        return false;
    }

    public static getAllSessionFromStorage() {

        let storageEvents = [];
        const SESSION_ARRAY_KEY = 'events';
        if (this.existsInStorage(SESSION_ARRAY_KEY))
          storageEvents = JSON.parse(localStorage.getItem(SESSION_ARRAY_KEY));
    
        let events = [];
    
        storageEvents.forEach(item => {
              events.push(item);
        });
    
        return events;
      }


}