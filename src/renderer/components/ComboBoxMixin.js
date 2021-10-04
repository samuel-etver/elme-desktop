import React from 'react';

class ComboBoxMixin {
    initComboBoxMixin () {
        this.comboboxRef = React.createRef();
        this.selectContainerRef = React.createRef();
        this.onToggle = this.onToggle.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
    }


    onToggle () {
        let el = this.selectContainerRef.current;
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
           el.style.visibility = 'visible';
           el.focus();
        } else {
           el.blur();
           el.style.visibility = 'hidden';
        }
    }


    onClickItem (value) {
        this.onToggle();
        this.sendSubmit(value);
    }


    sendChange (value) {
        this.props.callback && this.props.callback('change', value);
    }


    sendSubmit (value) {
        this.props.callback && this.props.callback('submit', value);
    }


    onChange (event) {
        this.sendChange(event.target.value);
    }


    onKeyPressed (event) {
        if (event.key === "Enter") {
            this.sendSubmit();
        }
    }
}


export default ComboBoxMixin;
