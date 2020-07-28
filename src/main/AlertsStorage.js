const MainEventManager = require('../common/MainEventManager');

let instance;

let mainEventManager = MainEventManager.getInstance();

class AlertsStorage {
    constructor() {
        if ( instance ) {
            return instance;
        }
        this.alerts = [];
        instance = this;
    }

}

module.exports = {
    getInstance: () => instance ?? new AlertsStorage()
}
