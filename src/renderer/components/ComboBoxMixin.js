
class ComboBoxMixin {
    getId(id) {
        if ( this.props.prefix ) {
            return this.props.prefix + id;
        }
        if ( this.props.options && this.props.options.prefix ) {
            return this.props.options.prefix + id;
        }
        return id;
    }


    onToggle() {
        let el = document.getElementById(this.getId('selectContainer'));
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
           el.style.visibility = 'visible';
           el.focus();
        } else {
           el.blur();
           el.style.visibility = 'hidden';
        }
    }


    sendChange(value) {
        if ( this.props.callback ) {
            this.props.callback('change', value);
        }
    }


    sendSubmit(value) {
        if ( this.props.callback ) {
            this.props.callback('submit', value);
        }
    }


    onChange(event) {
        this.sendChange(event.target.value);
    }


    onKeyPressed(event) {
        if ( event.key === "Enter" ) {
            this.sendSubmit();
        }
    }
}


export default ComboBoxMixin;
