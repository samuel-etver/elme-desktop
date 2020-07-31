const Constants = require('./Constants');
const MainEventManager = require('./MainEventManager');

let mainEventManager = MainEventManager.getInstance();

const fields = [
    'date',
    'inductorTemperature1',
    'inductorTemperature2',
    'thermostatTemperature1',
    'thermostatTemperature2',
    'sprayerTemperature',
    'heatingTemperature',
    'waterFlow'
];
const fieldsCount = fields.length;

function addFields(src) {
    if ( !src ) {
        src = {};
    }
    fields.forEach(fieldName => {
        src[fieldName] = []
    });
    return src;
}


class Measures {
    constructor() {
        this.fields = fields;
        this.fieldsCount = fieldsCount;
        addFields(this);
    }


    get dateFrom() {
        return this.isEmpty() ? undefined : this.date[0];
    }


    get dateTo() {
        return this.isEmpty() ? undefined : this.date[this.date.length - 1];
    }


    append(newData) {
        if ( !newData || !newData.length) {
            return true;
        }

        for ( let i = 1; i < newData.length; i++ ) {
            if ( newData[i].date.getTime() <= newData[i-1].date.getTime() ) {
                return false;
            }
        }

        if ( !this.isEmpty() ) {
            if ( newData[newData.length - 1].date.getTime() <= this.dateTo.getTime() ) {
                return false;
            }
        }

        for (let item of newData) {
            fields.forEach(fieldName => this[fieldName].push(item[fieldName]));
        }
    }


    delete(toDate) {
        if ( this.isEmpty() ) {
            return;
        }

        let toDateInt = toDate.getTime();
        let index = this.date.findIndex(dt => dt.getTime() > toDateInt);
        if ( index < 0 ) {
            addFields(this);
        }
        else {
            fields.forEach(fieldName => {
                this[fieldName] = this[fieldName].slice(index);
            });
        }
    }


    isEmpty() {
        return !this.date.length;
    }


    read(dateFrom, dateTo) {
        let dateFromInt = dateFrom.getTime();
        let dateToInt = dateTo.getTime();

        let dateFromIndex = this.date.findIndex(dt => dt.getTime() >= dateFromInt);
        if ( dateFromIndex < 0) {
            return addFields();
        }
        let dateToIndex;
        for (dateToIndex = dateFromIndex + 1; dateToIndex < this.date.length; dateToIndex++) {
            if ( this.date[dateToIndex].getTime() > dateToInt ) {
                break;
            }
        }

        let result = {};
        fields.forEach(fieldName => {
            result[fieldName] = this[fieldName].slice(dateFromIndex, dateToIndex);
        });
        return result;
    }
}


module.exports = Measures;
