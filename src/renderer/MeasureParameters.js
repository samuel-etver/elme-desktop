
var MeasureParameters = new function() {
    var instance = this;

    var temperatureUnits = '\u2103';
    var waterflowUnits = 'м\u00B3/c';

    var parameters = {};

    var create = function(name, caption, units) {
         parameters[name] = {
            name: name,
            caption: caption,
            units: units
        }
    }

    create('inductor1Temperature',
           'Температура индуктора 1',
           temperatureUnits);
    create('inductor2Temperature',
           'Температура индуктора 2',
           temperatureUnits);
    create('thermostatTemperature1',
           'Термостат 1',
           temperatureUnits);
    create('thermostatTemperature2',
           'Термостат 2',
           temperatureUnits);
    create('sprayerTemperature',
           'Температура на спреере',
           temperatureUnits);
    create('heatingTemperature',
           'Подогрев',
           temperatureUnits);
    create('waterflow',
           'Расход воды',
           waterflowUnits);          

    this.get = function(name) {
        return parameters[name];
    }

    return function() {
        return instance;
    }
}

export default MeasureParameters;
