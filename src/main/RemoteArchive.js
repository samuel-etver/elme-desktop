Constants = require('../common/Constants');
MainEventManager = require('../common/MainEventManager');
EventManager = require('../common/EventManager');

let mainEventManager = MainEventManager.getInstance();

class RemoteArchive {
    constructor () {
        this.name = 'remote';
        this.eventManager = new EventManager();
        this.openSequence = this.createOpenSequence();
        this.opened = false;
    }


    createOpenSequence () {

    }


    open (callback) {
    }


    close () {
    }


    isOpened () {
        return this.opened;
    }


    read (dateFrom, dateTo, callback) {

    }


    appendMeasures (newMeasures, callback) {
    }


    delete () {

    }


    getDateFrom () {

    }


    readDateFrom (callback) {

    }
}

module.exports = RemoteArchive;
