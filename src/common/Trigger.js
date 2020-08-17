class Trigger {
    constructor() {
        this.reset();
    }


    reset() {
        this.value = undefined;
        this.changed = false;
    }


    set value(newValue) {
        if (newValue === this.value) {
            this.changed = false;
        }
        else if ( newValue ) {
            this.changed = newValue.isStateSame(this.value);
        }
        else {
            this.changed = true;
        }

        if ( this.changed ) {
            this.value = newValue;
        }
    }
}

module.exports = Trigger;
