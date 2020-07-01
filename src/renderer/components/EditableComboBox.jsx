import './EditableComboBox.css';
import React from 'react';
import ComboBoxMixin from './ComboBoxMixin';

class EditableComboBox extends React.Component {
    constructor(props) {
        super(props);
        this.comboboxRef = React.createRef();
        this.selectContainerRef = React.createRef();
        this.onToggle = this.onToggle.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getId = this.getId.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
    }


    onClickItem(id, caption) {
        this.onToggle();
        this.sendSubmit(caption);
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
                list.push(
                  <li class={item.checked ? checkedClass : mainClass}
                    value={item.id}
                    onClick={getOnClick(item.id, item.caption)}>
                      {item.caption}
                  </li>
                );
            }
        }

        return  <div ref={this.comboboxRef} class={"editable-combobox " + this.props.style} >
                    <div class={"editable-combobox-container "}>
                        <input class="editable-combobox-input"
                          value={this.props.value}
                          onChange={this.onChange}
                          onBlur={this.onSubmit}
                          onKeyPress={this.onKeyPressed}/>
                        <div class="editable-combobox-button" onClick={this.onToggle}/>
                    </div>
                    <ul ref={this.selectContainerRef}
                      class="editable-combobox-select-container"
                      id={getId("selectContainer")}
                      onBlur={this.onToggle}>
                        {list}
                    </ul>
                </div>
    }
}


for (let key of Object.getOwnPropertyNames(ComboBoxMixin.prototype)) {
    EditableComboBox.prototype[key] = ComboBoxMixin.prototype[key];
}


export default EditableComboBox;
