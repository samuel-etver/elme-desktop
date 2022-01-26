const Measures = require('../common/Measures');
const MainEventManager = require('../common/MainEventManager');
const DeviceData = require('../common/DeviceData');

let mainEventManager = MainEventManager.getInstance();

class MemoryArchive {
    constructor () {
        this.name = 'memory';
        this.measures = new Measures();
        this.pipes = [];
        this.availableDates = [];
        this.opened = false;
    }


    isOpened () {
        return this.opened;
    }


    open (callback) {
        this.opened = true;
        this.appendDummyData();
        this.success(callback);
    }


    close (callback) {
        this.opened = false;
        this.success(callback);
    }


    read (dateFrom, dateTo, callback) {
        let result = this.measures.read(dateFrom, dateTo);
        this.success(callback, result);
    }


    appendMeasures (measuresList, callback) {
        this.measures.append(measuresList)
          ? this.success(callback)
          : this.failure(callback, {});
    }


    delete (dateTo, callback) {
        this.measures.delete(dateTo);
        this.success(callback);
    }


    deleteAll (callback) {
        this.measures = new Measures();
        this.pipes = [];
        this.availableDates = [];
        this.success(callback);
    }


    getDateFrom () {
        return this.measures.dateFrom;
    }


    success (callback, ...restArgs) {
        callback && callback('success', ...restArgs);
    }


    failure (callback, error) {
        callback && callback('failure', error);
    }


    appendDummyData () {
        let genValue =
          baseValue => baseValue + Math.random()*10 - 5;
        let now = Date.now();
        let n = 60*60;
        let measures = [];
        for (let i = 0; i < n; i++) {
            let deviceData = new DeviceData();
            deviceData.date = new Date(now - (n-i)*1000);
            deviceData.inductorTemperature1 = genValue(1000);
            deviceData.inductorTemperature2 = genValue(900);
            deviceData.thermostatTemperature1 = genValue(800);
            deviceData.thermostatTemperature2 = genValue(700);
            deviceData.sprayerTemperature = genValue(600);
            deviceData.heatingTemperature = genValue(500);
            deviceData.waterFlow = genValue(150);
            measures.push(deviceData);
        }
        this.appendMeasures(measures);
    }
}

module.exports = MemoryArchive;
