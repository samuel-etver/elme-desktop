import './EditableComboBox.css';
import React from 'react';


class EditableComboBox extends React.Component {
    render() {
        return  <div class={"editable-combobox " + this.props.style}>
                    <input class="editable-combobox-input"/>
                    <div class="editable-combobox-button"/>
                </div>
    }
}

export default EditableComboBox;
