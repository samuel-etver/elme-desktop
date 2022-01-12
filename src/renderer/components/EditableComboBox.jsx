import './EditableComboBox.css';
import React from 'react';
import ComboBoxMixin from './ComboBoxMixin';

class EditableComboBox extends React.PureComponent {
    constructor (props) {
        super(props);
        this.initComboBoxMixin();
    }


    render () {
        let list = [];
        if (this.props.items) {
            let mainClass = "editable-combobox-select-option";
            let checkedClass = mainClass + " editable-combobox-select-option-checked";
            for (let item of this.props.items) {
                list.push(
                  <div class={item.checked ? checkedClass : mainClass}
                    value={item.id}
                    onClick={() => this.onClickItem(item.caption)}>
                      {item.caption}
                  </div>
                );
            }
        }

        let gridTemplateColumns = "repeat(" +
          (this.props.columnsCount ?? "1") + ", " +
          (this.props.columnWidth ?? "100px") + ")";

        return  <div ref={this.comboboxRef} class={"editable-combobox " + this.props.addinClasses}>
                    <div class={"editable-combobox-container "}>
                        <input class="editable-combobox-input"
                          value={this.props.value}
                          onChange={this.onChange}
                          onBlur={this.onSubmit}
                          onKeyPress={this.onKeyPressed}/>
                        <div class="editable-combobox-button" onClick={this.onToggle}/>
                    </div>
                    <div ref={this.selectContainerRef}
                      class="editable-combobox-select-container"
                      style={{gridTemplateColumns: gridTemplateColumns}}
                      onBlur={this.onToggle}>
                        {list}
                    </div>
                </div>;
    }
}


for (let key of Object.getOwnPropertyNames(ComboBoxMixin.prototype)) {
    EditableComboBox.prototype[key] = ComboBoxMixin.prototype[key];
}


export default EditableComboBox;
