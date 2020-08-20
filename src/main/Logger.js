const infoLevel = 0;
const warningLevel = 1;
const severeLevel = 2;

const levelStrings = {
    [infoLevel]: 'INFO',
    [warningLevel]: 'WARNING',
    [severeLevel]: 'SEVERE'
};

class Logger {
    constructor() {
        this.handlers = [];
    }


    log(level, text) {
        let date = new Date();
        this.handlers.forEach(handle => handle.log(level, date, text));
    }


    info(text) {
        this.log(infoLevel, text);
    }


    warning(text) {
        this.log(warningLevel, text);
    }


    sever(text) {
        this.log(severeLevel, text);
    }


    addHandler(handler) {
        this.handlers.push(handler);
    }


    removeHandler(handler) {
        this.handlers = this.handlers.filter(currHandler => currHandler !== handler);
    }


    static levelToString(level) {
        return levelStrings[level];
    }
}


module.exports = Logger;
