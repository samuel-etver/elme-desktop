
class ComboBoxMixin {
    getId(id) {
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
}


export default ComboBoxMixin;
