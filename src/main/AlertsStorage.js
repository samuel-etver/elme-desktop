const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');
const AlertStorageItem = require('../common/AlertStorageItem');

let instance;

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();


class AlertsStorage {
    constructor() {
        if ( instance ) {
            return instance;
        }
        instance = this;
        this.alerts = [
        ];
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.timerId = undefined;
        this.changed = false;
        mainEventManager.subscribe('app-load', this.onAppLoad);
        this.i = 0;
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
      //  if ( this.changed ) {
      //      this.changed = false;
            this.i = this.i ? 0 : 1;
            let item1 = AlertStorageItem.now(1000);
            let item2 = AlertStorageItem.now(1100);
            let a = this.i ? [item1, item2] : [item1];
            globalStorage['mainWindow'].send('alerts-storage-receive', a);//this.alerts);
    //    }
        this.timerId = setTimeout(this.onTimer, 2000);
    }


    push(newItem) {
        let index = this.find(newItem.id);
        if ( index < 0 ) {
            this.alerts.push(newItem);
            this.changed = true;
        }
    }


    pull(id) {
        let index = this.find(id);
        if ( index >= 0 ) {
            this.alerts = this.alerts.splice(index, 1);
            this.changed = true;
        }
    }


    find(id) {
        return this.alerts.findIndex(item => item.id === id);
    }
}

(function(){
    new AlertsStorage();
})();

module.exports = {
    getInstance: () => instance
}
