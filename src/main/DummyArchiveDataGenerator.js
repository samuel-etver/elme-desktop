const MainEventManager = require('./../common/MainEventManager');
const Measures = require('./../common/Measures');

let mainEventManager = MainEventManager.getInstance();

class DummyArchiveDataGenerator {
    constructor () {
        this.measures = undefined;
        this.generate();
    }


    generate () {
        this.measures = this.generateMeasures();
    }


    generateMeasures () {
        let measuresList = [];

        let addSeconds = function (dt, seconds) {
            return new Date(dt.getTime() + seconds*1000);
        };
        let addMinutes = function (dt, minutes) {
            return addSeconds(dt, minutes*60);
        };

        let nextDate = addSeconds(new Date(), -5);
        for (let i = 0; i < 100; i++) {
            let measures = new Measures();
            measures.date = nextDate;
            measures.inductorTemperature1 = 450;
            measures.inductorTemperature2 = 550;
            measures.thermostatTemperature1 = 650;
            measures.thermostatTemperature2 = 750;
            measures.sprayerTemperature = 850;
            measures.heatingTemperature = 950;
            measures.waterFlow = 150;
            measuresList.push(measures);
            nextDate = addSeconds(nextDate, -1);
        }

        return measuresList;
    }


    getMeasures () {
        return this.measures;
    }

};

module.exports = DummyArchiveDataGenerator;
