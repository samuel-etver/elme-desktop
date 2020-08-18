const Logger = require('./Logger');
const FileLoggerHandler = require('./FileLoggerHandler');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');

let instance;

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

class MainLogger extends Logger {
    constructor() {
        super('Main');
        if ( !!instance ) {
            return instance;
        }
        this.fileHandler = new FileLoggerHandler();
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        mainEventManager.subscribe('app-load', this.onAppLoad);
        instance = this;
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        this.fileHandler.open(globalStorage.loggerFolderPath);
        this.addHandler(this.fileHandler);
    }


    onAppClose() {
        mainEventManager.unsubscribe('app-close', this.onAppClose);
        this.removeHandler(this.fileHandler);
        this.fileHandler.close();
    }
}

module.exports = {
    getInstance: () => instance ?? new MainLogger(),
}
