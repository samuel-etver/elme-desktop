class Trigger {
    constructor() {
        this._value = undefined;
        this.changed = false;
    }


    reset() {
        this._value = undefined;
        this.changed = false;
    }


    get value() {
        return this._value;
    }


    set value(newValue) {
        if (newValue === this._value) {
            this.changed = false;
        }
        else if ( newValue ) {
            this.changed = newValue.isStateSame(this._value);
        }
        else {
            this.changed = true;
        }

        if ( this.changed ) {
            this._value = newValue;
        }
    }
}

module.exports = Trigger;
