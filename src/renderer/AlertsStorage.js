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
        ipc.on('alerts-storage-receive', (event, arg) => this.onAlertsStorageReceive(arg));
    }


    onAppClose() {
        clearTimeout(this.timerId);
        mainEventManager.unsubscribe('app-close', this.onAppClose);
    }


    onAlertsStorageReceive(arg) {
        this.alerts = arg;
    }


    getAlerts() {
        return this.alerts;
    }


    isAlertsSame(alerts1, alerts2) {
        let alerts1Len = alerts1 ? alerts1.length : 0;
        let alerts2Len = alerts2 ? alerts2.length : 0;

        if (alerts1Len !== alerts2Len) {
            return false;
        }

        if (!alerts1Len) {
            return true;
        }


        for (let i = 0; i < alerts1Len; i++) {
            let alerts1Item = alerts1[i];
            let alerts2Item = alerts2[i];
            if (alerts1Item.id             !== alerts2Item.id ||
                alerts1Item.date.getTime() !== alerts2Item.date.getTime()) {
                return false;
            }
        }

        return true;
    }
}


module.exports = {
    getInstance: () => instance ?? new AlertsStorage()
}
