const electron = window.require('electron');
const ipc = electron.ipcRenderer;
const MainEventManager = require('../common/MainEventManager');

let instance;

let mainEventManager = MainEventManager.getInstance();

class AlertsStorage {
    constructor() {
        if ( instance ) {
            return instance;
        }
        instance = this;
        this.alerts = [];
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onAlertsStorageReceive = this.onAlertsStorageReceive.bind(this);
        mainEventManager.subscribe('app-load', this.onAppLoad);
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        ipc.on('alerts-storage-receive', this.onAlertsStorageReceive);
    }


    onAppClose() {
        clearTimeout(this.timerId);
        mainEventManager.unsubscribe('app-close', this.onAppClose);
    }


    onAlertsStorageReceive(event, arg) {
        this.alerts = arg;
    }


    getAlerts() {
        return this.alerts;
    }
}


module.exports = {
    getInstance: () => instance ?? new AlertsStorage()
}
