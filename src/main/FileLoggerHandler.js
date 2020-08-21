const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');
const MainEventManager = require('../common/MainEventManager');

let mainEventManager = MainEventManager.getInstance();

class FileLoggerHandler {
    constructor(rootFolder) {
        this.rootFolder = rootFolder;
        this.date = undefined;
        this.handle = undefined;
    }


    open() {
        if ( this.isOpened() ) {
            return;
        }

        try {
            this.date = new Date();
            let folderPath = path.join(this.rootFolder, this.date.getFullYear().toString());
            if ( !fs.existsSync(folderPath) ) {
                fs.mkdirSync(folderPath);
            }
            let filePath = path.join(folderPath,
              this.date.getFullYear() + '-' +
              this.formatIntTo02(this.date.getMonth() + 1) +
              '.txt');
            this.handle = fs.openSync(filePath, 'a');
        }
        catch (e) {
            mainEventManager.publish('to-console', e.toString());
        }
    }


    close() {
        if ( this.isOpened() ) {
            fs.closeSync(this.handle);
            this.handle = undefined;
        }
    }


    isOpened() {
        return !!this.handle;
    }


    log(level, date, text) {
        let currDate = new Date();

        this.isOpened();

        let checkOpenNew = function() {
            if ( !this.isOpened() ) {
                return true;
            }
            if ( currDate.getMonth() != this.date.getMonth() ) {
                return true;
            }
            return false;
        }.bind(this);

        if ( checkOpenNew() ) {
            this.close();
            this.open();
        }

        if ( this.isOpened() ) {
            let outputText = Logger.levelToString(level) + ' ('
              + date.getFullYear() + '-'
              + this.formatIntTo02(date.getMonth() + 1) + '-'
              + this.formatIntTo02(date.getDate()) + ' '
              + this.formatIntTo02(date.getHours()) + ':'
              + this.formatIntTo02(date.getMinutes()) + ':'
              + this.formatIntTo02(date.getSeconds()) + ')\r\n'
              + text
              + '\r\n\r\n';
            fs.writeSync(this.handle, Buffer.from(outputText));
        }
    }


    formatIntTo02(value) {
        return (value < 10) ? ('0' + value) : value.toString();
    }

}

module.exports = FileLoggerHandler;
