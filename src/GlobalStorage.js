
var instance;

class GlobalStorage {
    constructor() {
        if ( !!instance ) {
            return instance;
        }
        instance = this;
        this.config = {};
    }
}

module.exports = {
    getInstance: function() {
        if ( !instance ) {
            return new GlobalStorage();
        }
        return instance;
    }
}
