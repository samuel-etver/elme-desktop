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
                    <EditableComboBox style={"date-input-pane-year-combobox"} />
                    <Label text="Месяц:" />
                    <EditableComboBox style={"date-input-pane-month-combobox"} />
                    <Label text="День:" />
                    <EditableComboBox style={"date-input-pane-day-combobox"} />
                    <Label text="Час:" />
                    <EditableComboBox  style={"date-input-pane-hour-combobox"}/>
                </div>;
    }
}


export default DateInputPane;
