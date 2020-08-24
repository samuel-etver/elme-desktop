class AlertStorageItem {
    static stateOn = 1;
    static stateOff = -1;


    constructor() {
        this.id = undefined;
        this.date = undefined;
        this.state = undefined;
    }


    static now(id) {
        let newItem = new AlertStorageItem();
        newItem.date = new Date();
        newItem.id = id;
        return newItem;
    }


    isStateSame(src) {
        return !!(src && this.state === src.state);
    }
}

module.exports = AlertStorageItem;
