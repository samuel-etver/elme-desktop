const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');

let instance;

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

class AlertsStorage {
    constructor() {
        if ( instance ) {
            return instance;
        }
        instance = this;
        this.alerts = [];
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.timerId = undefined;
        this.changed = false;
        mainEventManager.subscribe('app-load', this.onAppLoad);
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        this.timerId = setTimeout(this.onTimer, 2000);
    }


    onAppClose() {
        clearTimeout(this.timerId);
    }


    onTimer() {
        if ( this.changed ) {
            this.changed = false;
            globalStorage['mainWindow'].send('alerts-data-receive', this.alerts);
        }
        this.timerId = setTimeout(this.onTimer, 2000);
    }
}

(function(){
    new AlertsStorage();
})();

module.exports = {
    getInstance: () => instance
}
