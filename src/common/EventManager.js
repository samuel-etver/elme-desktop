
class EventManager {
    constructor(name) {
        this.subscribers = {};
        this.name = name;
    }


    subscribe(event, listener) {
        if ( !this.subscribers[event] ) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push( listener );
    }


    publish(event, ...args) {
      //  console.log(event);
        let allListeners = this.subscribers[event];
        allListeners&&(allListeners.forEach(listener => {
            new Promise(() => listener(event, ...args));
        }));
    }


    unsubscribe(event, listener) {
        let listeners = this.subscribers[event];
        if ( listeners ) {
            this.subscribers[event] = listeners.filter(x => x !== listener);
        }
    }
}

module.exports = EventManager;
