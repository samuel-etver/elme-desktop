import './DateInputPane.css';
import React from 'react';
import EditableComboBox from './EditableComboBox';
import Constants from '../../common/Constants';
import MainEventManager from '../../common/MainEventManager';

let mainEventManager = MainEventManager.getInstance();

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
            let str = Constants.months[i];
            add(this.monthList, Constants.months.capitalize(i), i);
        }

        this.dayList = [];

        this.hourList = [];
        for (let i = 0; i < 24; i++) {
            add(this.hourList, i.toString(), i);
        }

        this.onClockButtonClick = this.onClockButtonClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    onClockButtonClick() {
        if ( this.props.options.callback ) {
            let date = new Date();
            this.props.options.callback('submit', {
                hour: date.getHours(),
                day: date.getDate(),
                month: Constants.months.capitalize(date.getMonth()),
                year: date.getFullYear(),
                valid: true
            });
        }
    }


    onChange(source, event, value) {
        let data = {
            [source]: value
        };


        if ( event === 'change' ) {
            if ( this.props.options.callback ) {
                this.props.options.callback(event, data);
            }
            return;
        }

        if ( value === undefined ) {
            value = this.props.options[source];
            data[source] = value;
        }


        let valueInt = parseInt(value);
        let newValue;

        switch(source) {
            case 'year': {
                if ( valueInt >= 0 && valueInt < 100 ) {
                    let currDate = new Date();
                    newValue = ((currDate.getFullYear()/100) >> 0)*100 + valueInt;
                }
                else if ( valueInt < 0 && valueInt > -100 ) {
                    let currDate = new Date();
                    newValue = currDate.getFullYear() + valueInt;
                }
                break;
            }

            case 'month': {
                if ( valueInt >= 1 && valueInt <= 12 ) {
                    newValue = Constants.months.capitalize(valueInt - 1);
                }
                else if ( valueInt <= 0 && valueInt <= 12 ) {
                    let currDate = new Date();
                    newValue = Constants.months.capitalize((currDate.getMonth() + 12 + valueInt) % 12);
                }
                break;
            }

            case 'day': {
                if ( valueInt <= 0 && valueInt > -1000 ) {
                  let currDate = new Date( Date.now() + valueInt*24*60*60*1000 );
                  data['year'] = currDate.getFullYear().toString();
                  data['month'] = Constants.months.capitalize( currDate.getMonth() );
                  newValue = currDate.getDate();
                }
                break;
            }

            case 'hour': {
                if ( valueInt < 0 && valueInt > -1000 ) {
                    let currDate = new Date( Date.now() + valueInt*60*60*1000 );
                    data['year'] = currDate.getFullYear().toString();
                    data['month'] = Constants.months.capitalize( currDate.getMonth() );
                    data['day'] = currDate.getDate().toString();
                    newValue = currDate.getHours();
                }
            }
        }


        if ( newValue !== undefined ) {
            data[source] = newValue.toString();
        }


        let checkingDate = {};
        for (let item of ['hour', 'day', 'month', 'year']) {
            checkingDate[item] = data[item] !== undefined
              ? data[item]
              : this.props.options[item];
        }
        data['valid'] = this.checkDate(checkingDate);

        if ( this.props.options.callback ) {
            this.props.options.callback(event, data);
        }
    }


    checkDate(checkingDate) {
        let year = parseInt(checkingDate.year);
        if ( !(year >= 2000 && year <= 2100) ) {
            return false;
        }

        let hour = parseInt(checkingDate.hour);
        if ( !(hour >= 0 && hour <= 23) ) {
            return false;
        }

        let month = checkingDate.month;
        if ( !Constants.months.has(month) ) {
            return false;
        }

        let day = checkingDate.day;
        if ( !(day >= 1 && day <= 31) ) {
            return false;
        }

        let date = new Date(year, Constants.months.find(month) + 1, 0);
        if ( !(day <= date.getDate()) ) {
            return false;
        }

        return true;
    }


    render() {
        let a = e => {this.onChange('year', e.target.value)};
        return  <div class="date-input-pane">
                    <button
                      class="date-input-pane-current-time-button"
                      onClick={this.onClockButtonClick}
                    />
                    <Label text="Год:" />
                    <EditableComboBox
                      style="date-input-pane-year-combobox"
                      value={this.props.options.year}
                      prefix="year-"
                      callback={(...args) => this.onChange('year', ...args)}
                    />
                    <Label text="Месяц:" />
                    <EditableComboBox
                      style="date-input-pane-month-combobox"
                      value={this.props.options.month}
                      items={this.monthList}
                      prefix="month-"
                      callback={(...args) => this.onChange('month', ...args)}
                    />
                    <Label text="День:" />
                    <EditableComboBox
                      style="date-input-pane-day-combobox"
                      value={this.props.options.day}
                      list={this.dayList}
                      prefix="day-"
                      callback={(...args) => this.onChange('day', ...args)}
                    />
                    <Label text="Час:" />
                    <EditableComboBox
                      style="date-input-pane-hour-combobox"
                      value={this.props.options.hour}
                      items={this.hourList}
                      prefix="hour-"
                      callback={(...args) => this.onChange('hour', ...args)}
                    />
                </div>;
    }
}


export default DateInputPane;
