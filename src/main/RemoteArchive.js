const Constants = require('../common/Constants');
const MainEventManager = require('../common/MainEventManager');
const EventManager = require('../common/EventManager');
const GlobalStorage = require('../common/GlobalStorage');
const axios = require('axios');


let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();


class RemoteArchive {
    constructor () {
        this.name = 'remote';
        this.eventManager = new EventManager();
        this.openSequence = this.createOpenSequence();
        this.opened = false;
        this.dateFrom = undefined;
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
        return this.dateFrom;
    }


    readDateFrom (callback) {

    }
}


module.exports = RemoteArchive;
