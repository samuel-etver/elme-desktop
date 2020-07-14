const sqlite3 = require('sqlite3');
const Constants = require('../common/Constants');
const GlobalStorage = require('../common/GlobalStorage');
const MainEventManager = require('../common/MainEventManager')
const path = require('path');

let globalStorage = GlobalStorage.getInstance();
let mainEventManager = MainEventManager.getInstance();
const dbName = Constants.appName + '.db';

class LocalArchive {
    constructor() {
        this.opened = false;
        this.dbPath = undefined;
        this.db = undefined;
    }


    open() {
        this.close();

        if ( !this.dbPath ) {
            this.dbPath = path.join(globalStorage.homeDir, dbName);
        }

        this.db = new sqlite3.Database(this.dbPath, err => {
            if ( err ) {
            } else {
                this.opened = true;
            }
        });

    }


    close() {
        if ( this.opened ) {
            this.opened = false;
            this.db.close();
        }
        this.db = undefined;
    }


    isOpened() {
        return this.opened;
    }


    read() {

    }


    write() {

    }


    delete() {

    }
}

module.exports = LocalArchive;
