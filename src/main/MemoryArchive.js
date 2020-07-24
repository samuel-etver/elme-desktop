const MainEventManager = require('../common/MainEventManager');

let mainEventManager = MainEventManager.getInstance();

class MemoryArchive {
    constructor() {
        this.name = 'memory';
        this.measures = [];
        this.pipes = [];
        this.availableDates = [];
        this.opened = false;
        this.dateFrom = undefined;
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
        let result = {
            measures: [],
        };
        let dateFromInt = dateFrom.getTime();
        let dateToInt   = dateTo.getTime();
        this.measures.forEach(item => {
            let dtInt = item.date.getTime();
            if ( dtInt >= dateFromInt && dtInt <= dateToInt ) {
                result.measures.push(item);
            }
        });

        this.success(callback, result);
    }


    appendMeasures(newMeasures, callback) {
        if ( !newMeasures || !newMeasures.length) {
            this.success();
            return;
        }

        for ( let i = 1; i < newMeasures.length; i++ ) {
            if ( newMeasures[i].date.getTime() <= newMeasures[i-1].date.getTime() ) {
                this.failure(callback, {});
                return;
            }
        }

        if ( this.measures.length ) {
            if ( newMeasures[newMeasures.length - 1].date.getTime() <=
                 this.measures[this.measures.length - 1].date.getTime() ) {
                this.failure(callback, {});
                return;
            }
        }

        this.measures.push(...newMeasures);
        this.dateFrom = this.measures[this.measures.length - 1].date;
        this.success(callback);
    }


    delete(dateTo, callback) {
        let dateToInt = dateTo.getTime();
        this.measures = this.measures.filter(item => item.date.getTime() > dateToInt);
        this.dateFrom = this.measures.length
          ? this.measures[this.measures.length - 1].date
          : undefined;
        this.success(callback);
    }


    deleteAll(callback) {
        this.measures = [];
        this.pipes = [];
        this.availableDates = [];
        this.success(callback);
    }


    success(callback, ...restArgs) {
        callback && callback('success', ...restArgs);
    }


    failure(callback, error) {
        callback && callback('failure', error);
    }
}

module.exports = MemoryArchive;
