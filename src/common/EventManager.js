
class EventManager {
    constructor () {
        this.subscribers = {};
    }


    subscribe (event, listener) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(listener);
    }


    publish (event, ...args) {
        let all = this.subscribers[event];
        all && (all.forEach(listener => listener(event, ...args)));
    }


    unsubscribe (event, listener) {
        let all = this.subscribers[event];
        all && (this.subscribers[event] = all.filter(x => x !== listener));
    }
}

module.exports = EventManager;
