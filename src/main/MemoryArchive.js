const Measures = require('../common/Measures');
const MainEventManager = require('../common/MainEventManager');

let mainEventManager = MainEventManager.getInstance();

class MemoryArchive {
    constructor() {
        this.name = 'memory';
        this.measures = new Measures();
        this.pipes = [];
        this.availableDates = [];
        this.opened = false;
    }


    isOpened() {
        return this.opened;
    }


    open(callback) {
        this.opened = true;
        this.success(callback);
    }


    close(callback) {
        this.opened = false;
        this.success(callback);
    }


    read(dateFrom, dateTo, callback) {
        let result = this.measures.read(dateFrom, dateTo);
        this.success(callback, result);
    }


    appendMeasures(newMeasures, callback) {
        this.measures.append(newMeasures)
          ? this.success(callback)
          : this.failure(callback, {});
    }


    delete(dateTo, callback) {
        this.measures.delete(dateTo);
        this.success(callback);
    }


    deleteAll(callback) {
        this.measures = new Measures();
        this.pipes = [];
        this.availableDates = [];
        this.success(callback);
    }


    get dateFrom() {
        return this.measures.dateFrom;
    }


    success(callback, ...restArgs) {
        callback && callback('success', ...restArgs);
    }


    failure(callback, error) {
        callback && callback('failure', error);
    }
}

module.exports = MemoryArchive;
