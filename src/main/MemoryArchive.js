const EventManager = require('../common/EventManager');

class MemoryArchive {
    constructor() {
        this.measures = [];
        this.pipes = [];
        this.availableDates = [];
        this.opened = false;
        this.eventManager = new EventManager();
    }


    isOpened() {
        return this.opened;
    }


    open(callback) {
    }


    close(callback) {
        this.opened = false;
        this.success(callback);
    }


    read(fromDate, toDate, callback) {
    }


    write(data, callback) {
    }


    delete(toDate, callback) {
    }


    deleteAll(callback) {
        this.measures = [];
        this.pipes = [];
        this.availableDates = [];
        this.success(callback);
    }


    success(callback) {
        if ( callback ) {
            callback('success');
        }
    }
}

module.exports = MemoryArchive;
