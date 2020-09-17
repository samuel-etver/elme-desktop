var Alerts = new (function() {
    let instance = this;
    let alerts = {};
    this.size = 0;

    create(1000, 'noServerConnection', "Нет связи с сервером");
    create(1100, 'noDeviceConnection', "Нет связи с измерителем");

    function create(id, name, text) {
        let newAlert = {
            id: id,
            name: name,
            text: text
        };
        alerts[id] = newAlert;
        this.size++;
    };


    this.byId = function(id) {
        return alerts[id];
    }


    this.get = function(name) {
        for (let id in alerts) {
            let item = alerts[id];
            if (item.name === name) {
                return item;
            }
        }
    }



    return function() {
        return instance;
    };
})();

module.exports = Alerts;
