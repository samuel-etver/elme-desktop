class AlertStorageItem {
    constructor() {
        this.id = undefined;
        this.date = undefined;
    }

    static now(id) {
        let newItem = new AlertStorageItem();
        newItem.date = new Date();
        newItem.id = id;
        return newItem;
    }
}

module.exports = AlertStorageItem;
