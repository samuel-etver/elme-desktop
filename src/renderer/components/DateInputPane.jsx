import './DateInputPane.css';
import React from 'react';
import EditableComboBox from './EditableComboBox';
import Constants from '../../common/Constants';

class Label extends React.Component {
    render() {
        return  <div class="date-input-pane-label">
                    {this.props.text}
                </div>
    }
}


class DateInputPane extends React.Component {
    constructor(props) {
        super(props);

        var add = function(list, caption, id) {
            list.push({
                caption: caption,
                id: id
            });
        };

        this.yearList = [];

        this.monthList = [];
        for (let i = 0; i < Constants.months.length; i++) {
            add(this.monthList, Constants.months[i], i);
        }

        this.dayList = [];

        this.hourList = [];
        for (let i = 0; i < 24; i++) {
            add(this.hourList, i.toString(), i);
        }
    }

    render() {
        return  <div class="date-input-pane">
                    <Label text="Год:" />
                    <EditableComboBox
                      style={"date-input-pane-year-combobox"}
                      options={{
                        prefix: 'year-',
                      }}
                    />
                    <Label text="Месяц:" />
                    <EditableComboBox
                      style={"date-input-pane-month-combobox"}
                      items={this.monthList}
                      options={{
                        prefix: 'month-'
                      }}
                    />
                    <Label text="День:" />
                    <EditableComboBox
                      style={"date-input-pane-day-combobox"}
                      list={this.dayList}
                      options={{
                        prefix: 'day-'
                      }}
                    />
                    <Label text="Час:" />
                    <EditableComboBox
                      style={"date-input-pane-hour-combobox"}
                      items={this.hourList}
                      options={{
                        prefix: 'hour-'
                      }}
                    />
                </div>;
    }
}


export default DateInputPane;
