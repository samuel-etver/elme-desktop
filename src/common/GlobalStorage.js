
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
    getInstance: () => instance ?? new GlobalStorage()
}
