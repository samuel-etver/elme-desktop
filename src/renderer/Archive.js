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
            this.onArchiveDataRead = this.onArchiveDataRead.bind(this);
            this.onArchiveDataReady = this.onArchiveDataReady.bind(this);
            mainEventManager.subscribe('app-load', this.onAppLoad);
        }
        return instance;
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        mainEventManager.subscribe('archive-data-read', this.onArchiveDataRead);
        ipc.on('archive-data-ready', this.onArchiveDataReady);
    }


    onAppClose() {
        mainEventManager.unsubscribe('app-close', this.onAppClose);
        mainEventManager.unsubscribe('archive-data-read', this.onArchiveDataRead);
    }


    onArchiveDataRead(event, options) {
        ++this.packetId;
        ipc.send('archive-data-read', {
            dateFrom: options.dateFrom,
            dateTo: options.dateTo,
            id: this.packetId
        });
    }


    onArchiveDataReady(event, arg) {
        //mainEventManager.publish('log', '');
        mainEventManager.publish('archive-data-ready', arg);
    }
}


(function() {
    new Archive();
})();


export default Archive = {
    getInstance: () => instance,
}
