const fs = require('fs');
const path = require('path');
const MainEventManager = require('../common/MainEventManager');

let mainEventManager = MainEventManager.getInstance();

class FileLoggerHandler {
    constructor() {
        this.opened = false;
        this.rootFolder = undefined;
    }


    open(rootFolder) {
        this.close();
        this.rootFolder = rootFolder;

        function openImpl() {
            if ( !fs.existsSync(rootFolder) ) {
                fs.mkdirSync(rootFolder);
            }
            return false;
        }

        try {
            this.opened = openImpl();
        }
        catch(e) {
        }
    }


    close() {
        if ( this.opened ) {
            this.opened = false;
        }
    }


    isOpened() {
        return this.opened;
    }


    log(level, date, text) {
        if ( this.opened ) {
        }
    }
}

module.exports = FileLoggerHandler;
