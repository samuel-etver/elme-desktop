const Logger = require('./Logger');
const FileLoggerHandler = require('./FileLoggerHandler');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');

let instance;

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

class MainLogger extends Logger {
    constructor() {
        super();
        if ( !!instance ) {
            return instance;
        }
        this.fileHandler = undefined;
        this.timerId = undefined;
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.onLogInfo = this.onLogInfo.bind(this);
        this.onLogWarning = this.onLogWarning.bind(this);
        this.onLogSevere = this.onLogSevere.bind(this);
        mainEventManager.subscribe('app-load', this.onAppLoad);
        instance = this;
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        mainEventManager.subscribe('log-info', this.onLogInfo);
        mainEventManager.subscribe('log-warning', this.onLogWarning);
        mainEventManager.subscribe('log-severe', this.onLogSevere);
        this.fileHandler = new FileLoggerHandler(globalStorage.loggerFolderPath);
        this.addHandler(this.fileHandler);
        this.info("Application started");
        this.timerId = setInterval(this.onTimer, 1000*60*60);
    }


    onAppClose() {
        mainEventManager.unsubscribe('app-close', this.onAppClose);
        mainEventManager.unsubscribe('log-info', this.onLogInfo);
        mainEventManager.unsubscribe('log-warning', this.onLogWarning);
        mainEventManager.unsubscribe('log-severe', this.onLogSevere);
        clearTimeout(this.timerId);
        this.info("Application closed")
        this.removeHandler(this.fileHandler);
        this.fileHandler.close();
    }


    onTimer() {
        this.info("Application is working");
    }


    onLogInfo(event, arg) {
        this.info(arg);
    }


    onLogWarning(event, arg) {
        this.warning(arg);
    }


    onLogSevere(event, arg) {
        this.severe(arg);
    }
}

module.exports = {
    getInstance: () => instance ?? new MainLogger(),
}
