const MemoryArchive = require('./MemoryArchive');
const LocalArchive = require('./LocalArchive');
const RemoteArchive = require('./RemoteArchive');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');
const Constants = require('../common/Constants');
const DeviceData = require('../common/DeviceData');

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

let instance;

class Archive {
    constructor() {
        if ( !! instance ) {
            return instance;
        }
        this.archives = [];
        if ( Constants.memoryArchiveEnabled ) {
            this.archives.push(new MemoryArchive());
        }
        if ( Constants.localArchiveEnabled ) {
            this.archives.push(new LocalArchive());
        }
        if ( Constants.remoteArchiveEnabled ) {
            this.archives.push(new RemoteArchive());
        }

        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.timerId = undefined;
        this.onReadData = this.onReadData.bind(this);
        mainEventManager.subscribe('app-load', this.onAppLoad);
        instance = this;
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        mainEventManager.subscribe('archive-read-data', this.onReadData);
        this.timerId = setTimeout(this.onTimer, 1000);
    }


    onAppClose() {
        clearTimeout(this.timerId);
        mainEventManager.unsubscribe('app-close', this.onAppClose);
        mainEventManager.unsubscribe('archive-read-data', this.onReadData);
    }


    onTimer() {
        this.run();
        this.timerId = setTimeout(this.onTimer, 100);
    }


    run() {
        let archives = this.archives;
        archives.forEach(a => {
            if ( !a.isOpened() ) {
                a.open();
            }
        });

        let mostRecentArchive = archives[0];
        if ( mostRecentArchive.isOpened() ) {
            mostRecentArchive.appendMeasures([DeviceData.now()], ()=>{});
        }
    }


    onReadData(event, arg) {
/*        this.localArchive.read(arg.fromDate, arg.toDate, (result, data) => {
            switch(result) {
                case 'success':
                    break;
                case 'failure':
                    break;
                default: ;
            }
        });*/
    }
}


(function() {
    new Archive();
})();


module.exports = {
    getInstance: () => instance
}
