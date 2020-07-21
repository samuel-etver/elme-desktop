import MainEventManager from '../common/MainEventManager';
import GlobalStorage from '../common/GlobalStorage';

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

class Archive {
    constructor() {
        this.packetId = 0;
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        mainEventManager.subscribe('app-load', this.onAppLoad);
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
    }


    onAppClose() {
        mainEventManager.unsubscribe('app-close', this.onAppClose);
    }


    onArchiveDataReady() {

    }


    read(fromDate, toDate, callback) {
        ++this.packetId;
        mainEventManager.publish('archive-require-data', {
            fromDate: fromDate,
            toDate: toDate,
            id: this.packetId
        });
    }
}


export default Archive = {
  getInstance: () => {}
}
