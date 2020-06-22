import './EditableComboBox.css';
import React from 'react';
import ComboBoxMixin from './ComboBoxMixin';
import MainEventManager from '../../common/MainEventManager';

let mainEventManager = MainEventManager.getInstance();


class EditableComboBox extends React.Component {
    constructor(props) {
        super(props);
        this.comboboxRef = React.createRef();
        this.selectContainerRef = React.createRef();
        this.onToggle = this.onToggle.bind(this);
    }


    componentDidMount() {
        let width = this.comboboxRef.current.offsetWidth;
        this.selectContainerRef.current.style["width"] = width + "px";
    }


    render() {
        let getId = (id) => this.getId(id);

        let list = [];
        if ( this.props.items ) {
            for (let item of this.props.items) {
                list.push(
                    <li class="editable-combobox-select-option" value={item.id}>{item.caption}</li>
                );
            }
        }
        mainEventManager.publish('log', list.length.toString());

        return  <div ref={this.comboboxRef} class={"editable-combobox " + this.props.style}>
                    <div class={"editable-combobox-container "} onClick={this.onToggle}>
                        <input class="editable-combobox-input"/>
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
