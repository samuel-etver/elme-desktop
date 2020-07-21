LocalArchive = require('./LocalArchive');
RemoteArchive = require('./RemoteArchive');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

let instance;

class Archive {
    constructor() {
        if ( !! instance ) {
            return instance;
        }
        this.localArchive = new LocalArchive();
        this.remoteArchive = new RemoteArchive();
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.timerId = undefined;
        mainEventManager.subscribe('app-load', this.onAppLoad);
        instance = this;
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        this.timerId = setTimeout(this.onTimer, 1000);
    }


    onAppClose() {
        clearTimeout(this.timerId);
        mainEventManager.unsubscribe('app-close', this.onAppClose);
    }


    onTimer() {
        this.run();
        this.timerId = setTimeout(this.onTimer, 100);
    }


    run() {
        let localArchive = this.localArchive;
        let remoteArchive = this.remoteArchive;

        if ( !localArchive.isOpened() ) {
            localArchive.open();
        }
        if ( !remoteArchive.isOpened() ) {
            remoteArchive.open();
        }
    }


    open() {

    }


}


(function() {
    new Archive();
})();


module.exports = {
    getInstance: () => instance
}
