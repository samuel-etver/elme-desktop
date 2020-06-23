import './EditableComboBox.css';
import React from 'react';
import ComboBoxMixin from './ComboBoxMixin';
import MainEventManager from '../../common/MainEventManager';

let mainEventManager = MainEventManager.getInstance();


class EditableComboBox extends React.Component {
    constructor(props) {
        super(props);
        this.comboboxRef = React.createRef();
        this.inputRef = React.createRef();
        this.selectContainerRef = React.createRef();
        this.onToggle = this.onToggle.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
        this.getId = this.getId.bind(this);
    }


    onClickItem(id, caption) {
        this.inputRef.current.value = caption;
        this.onToggle();
        if ( this.props.options ) {
            if ( this.props.options.eventManager ) {
                let prefix = this.props.options.prefix;
                if ( !prefix ) {
                    prefix = '';
                }
                this.props.options.eventManager.publish(prefix + 'combobox-select', id);
            }
        }
    }


    componentDidMount() {
        let width = this.comboboxRef.current.offsetWidth;
        this.selectContainerRef.current.style["width"] = width + "px";
    }


    render() {
        let getId = (id) => this.getId(id);
        let o = this;
        let getOnClick = (id, caption) => {
            return function() {
                o.onClickItem(id, caption);
            }
        };

        let list = [];
        if ( this.props.items ) {
            let mainClass = "editable-combobox-select-option";
            let checkedClass = mainClass + " editable-combobox-select-option-checked";
            for (let item of this.props.items) {
                let currClass = item.checked ? checkedClass : mainClass;
                list.push(
                    <li class={currClass} value={item.id} onClick={getOnClick(item.id, item.caption)}>{item.caption}</li>
                );
            }
        }

        return  <div ref={this.comboboxRef} class={"editable-combobox " + this.props.style}>
                    <div class={"editable-combobox-container "} onClick={this.onToggle}>
                        <input ref={this.inputRef} class="editable-combobox-input"/>
                        <div class="editable-combobox-button"/>
                    </div>
                    <ul tabindex="0" ref={this.selectContainerRef} class="editable-combobox-select-container" id={getId("selectContainer")} onBlur={this.onToggle}>
                        {list}
                    </ul>
                </div>
    }
}


for (let key of Object.getOwnPropertyNames(ComboBoxMixin.prototype)) {
    EditableComboBox.prototype[key] = ComboBoxMixin.prototype[key];
}


export default EditableComboBox;
