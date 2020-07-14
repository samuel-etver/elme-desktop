const EventManager = require('./EventManager');

var instance;

class MainEventManager extends EventManager {
    constructor() {
        super('Main');
        if ( !!instance ) {
            return instance;
        }
        instance = this;
    }
}


module.exports = {
    getInstance: () => instance ?? new MainEventManager(),
}
