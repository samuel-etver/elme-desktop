
var MeasureParameters = new (function() {
    var instance = this;

    var temperatureUnits = '\u2103';
    var waterFlowUnits = 'м\u00B3/c';

    var parameters = {};
    var id = 1;
    var sorted = undefined;
    var size = 0;

    var create = function(name, caption, units) {
        sorted = undefined;
        if ( !parameters[name] ) {
            size++;
        }
        parameters[name] = {
            name: name,
            caption: caption,
            units: units,
            id: id++
        };
    };

    create('inductorTemperature1',
           'Температура индуктора 1',
           temperatureUnits);
    create('inductorTemperature2',
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
    create('waterFlow',
           'Расход воды',
           waterFlowUnits);

    this.get = function(name) {
        return parameters[name];
    };

    this.size = () => size;

    this.byIndex = index => {
        if ( !sorted ) {
            let tmpArr = [];
            for (let itemName in parameters) {
                tmpArr.push(parameters[itemName]);
            }
            tmpArr.sort((item1, item2) => item1.caption.localeCompare(item2.caption));
            sorted = tmpArr;
        }
        return sorted[index];
    };

    this.byId = id => {
        for (let itemName in parameters) {
            if (parameters[itemName].id === id) {
                return parameters[itemName];
            }
        }
    };

    return function() {
        return instance;
    };
})();

module.exports = MeasureParameters;
