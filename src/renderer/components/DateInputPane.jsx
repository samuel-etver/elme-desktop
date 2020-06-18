import './DateInputPane.css';
import React from 'react';
import EditableComboBox from './EditableComboBox';

class Label extends React.Component {
    render() {
        return  <div class="date-input-pane-label">
                    {this.props.text}
                </div>
    }
}


class DateInputPane extends React.Component {
    render() {
        return  <div class="date-input-pane">
                    <Label text="Год:" />
                    <EditableComboBox />
                    <Label text="Месяц:" />
                    <EditableComboBox />
                    <Label text="День:" />
                    <EditableComboBox />
                    <Label text="Час:" />
                    <EditableComboBox />
                </div>;
    }
}


export default DateInputPane;
