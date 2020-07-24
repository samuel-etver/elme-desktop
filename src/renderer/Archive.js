import MainEventManager from '../common/MainEventManager';
import GlobalStorage from '../common/GlobalStorage';
const electron = window.require('electron');
const ipc = electron.ipcRenderer;

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

let instance;

class Archive {
    constructor() {
        if ( !instance ) {
            instance = this;
            this.packetId = 0;
            this.onAppLoad = this.onAppLoad.bind(this);
            this.onAppClose = this.onAppClose.bind(this);
            this.onDataReady = this.onDataReady.bind(this);
            mainEventManager.subscribe('app-load', this.onAppLoad);
        }
        return instance;
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        mainEventManager.subscribe('archive-data-ready', this.onDataReady);
    }


    onAppClose() {
        mainEventManager.unsubscribe('app-close', this.onAppClose);
        mainEventManager.unsubscribe('app-archive-data-ready', this.onDataReady);
    }


    read(dateFrom, dateTo) {
        ++this.packetId;
        ipc.send('read-archive-data', {
            dateFrom: dateFrom,
            dateTo: dateTo,
            id: this.packetId
        });
    }

    onDataReady() {
    }
}


(function() {
    new Archive();
})();


export default Archive = {
    getInstance: () => instance,
}
