const fs = require('fs');
const path = require('path');
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

        function openImpl() {
            if ( !fs.existsSync(rootFolder) ) {
                fs.mkdirSync(rootFolder);
            }
        }

        try {
            openImpl();
        }
        catch(e) {
        }
    }


    close() {
        if ( this.isOpened() ) {
            this.handle.close();
            this.handle = undefined;
        }
    }


    isOpened() {
        return !!this.handle;
    }


    log(level, date, text) {
        let currDate = new Date();

        function checkOpenNew() {
            if ( !this.isOpened() ) {
                return true;
            }
            if ( currDate.getMonth() != this.date.getMonth() ) {
                return true;
            }
            return false;
        }

        if ( checkOpenNew() ) {
            this.close();
            this.open();
        }

        if ( this.isOpened() ) {
            let formatIntTo02 = function(value) {
                return (value < 10) ? ('0' + value) : value.toString();
            };
            let outputText = this.levelToString(level) + ' ('
              + date.getFullYear() + '-'
              + formatIntTo02(date.getMonth() + 1) + '-'
              + formatIntTo02(date.getDate()) + ' '
              + formatIntTo02(date.getHours()) + ':'
              + formatIntTo02(date.getMinutes()) + ':'
              + formatIntTo02(date.getSeconds()) + ')\r\n'
              + text
              + '\r\n\r\n';
            fs.writeSync(this.handle, Buffer.from(outputText));
        }
    }
}

module.exports = FileLoggerHandler;
