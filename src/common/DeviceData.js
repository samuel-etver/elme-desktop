
let newId = 0;

class DeviceData {
    constructor() {
        this.date = null;
        this.inductorTemperature1 = null;
        this.inductorTemperature2 = null;
        this.thermostatTemperature1 = null;
        this.thermostatTemperature2 = null;
        this.sprayerTemperature = null;
        this.heatingTemperature = null;
        this.waterFlow = null;
        this.id = ++newId;
    }


    static now() {
        let newData = new DeviceData();
        newData.date = new Date();
        return newData;
    }
}

module.exports = DeviceData;
