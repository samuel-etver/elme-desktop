import './DateInputPane.css';
import React from 'react';
import EditableComboBox from './EditableComboBox';
import Constants from '../../common/Constants';


function addToList(list, caption, id, checked = false) {
    list.push({
        caption: caption,
        id: id
    });
};

let dayList = [];
for (let i = 1; i <= 31; i++) {
    addToList(dayList, i.toString(), i);
}


let Label = React.memo(function (props) {
    return  <div class="date-input-pane-label">
                {props.text}
            </div>;
});



class DateInputPane extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onClockButtonClick = this.onClockButtonClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    onClockButtonClick() {
        if (this.props.callback) {
            let date = new Date();
            this.props.callback('submit', {
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
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
            if ( this.props.callback ) {
                this.props.callback(event, data);
            }
            return;
        }

        if ( value === undefined ) {
            value = this.props[source];
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
                else {
                    valueInt = Constants.months.findByPartialMatch(value);
                    if (valueInt >= 0) {
                        newValue = Constants.months.capitalize(valueInt);
                    }
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
                break;
            }

            default: ;
        }


        if (newValue !== undefined) {
            data[source] = newValue.toString();
        }


        let checkingDate = {};
        for (let item of ['hour', 'day', 'month', 'year']) {
            checkingDate[item] = data[item] !== undefined
              ? data[item]
              : this.props[item];
        }
        data['valid'] = this.checkDate(checkingDate);

        if ( this.props.callback ) {
            this.props.callback(event, data);
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

        date = new Date(year, Constants.months.find(month), day);
        if ( date.getTime() < Constants.archiveDateMin.getTime() ) {
          return false;
        }

        return true;
    }


    createYearList () {
        let year = (new Date()).getFullYear();
        let yearList = [];
        for (let i = 0; i < 5; i++) {
            addToList(yearList, year.toString(), year);
            year--;
        }
        return yearList;
    }


    createMonthList () {
        if (this.monthList === undefined) {
            let monthList = [];
            for (let i = 0; i < Constants.months.length; i++) {
                addToList(monthList, Constants.months.capitalize(i), i);
            }
            this.monthList = monthList;
        }
        return this.monthList;
    }


    createDayList () {
        if (this.props.year && this.props.month) {

        }
        return dayList;
    }


    createHourList () {
        if (this.hourList === undefined) {
            let hourList = [];
            for (let i = 0; i < 24; i++) {
                addToList(hourList, i.toString(), i);
            }
            this.hourList = hourList;
        }
        return this.hourList;
    }


    render() {
        let yearList = this.createYearList();
        let monthList = this.createMonthList();
        let dayList = this.createDayList();
        let hourList = this.createHourList();

        return  <div class="date-input-pane">
                    <button
                      class="date-input-pane-current-time-button"
                      onClick={this.onClockButtonClick}
                    />
                    <Label text="Год:" />
                    <EditableComboBox
                      addinClasses="date-input-pane-year-combobox"
                      value={this.props.year}
                      items={yearList}
                      columnsCount="1"
                      columnWidth="80px"
                      callback={(...args) => this.onChange('year', ...args)}
                    />
                    <Label text="Месяц:" />
                    <EditableComboBox
                      addinClasses="date-input-pane-month-combobox"
                      value={this.props.month}
                      items={monthList}
                      columnsCount="3"
                      columnWidth="120px"
                      callback={(...args) => this.onChange('month', ...args)}
                    />
                    <Label text="День:" />
                    <EditableComboBox
                      addinClasses="date-input-pane-day-combobox"
                      value={this.props.day}
                      items={dayList}
                      columnsCount="10"
                      columnWidth="40px"
                      callback={(...args) => this.onChange('day', ...args)}
                    />
                    <Label text="Час:" />
                    <EditableComboBox
                      addinClasses="date-input-pane-hour-combobox"
                      value={this.props.hour}
                      columnsCount="6"
                      columnWidth="40px"
                      items={hourList}
                      callback={(...args) => this.onChange('hour', ...args)}
                    />
                </div>;
    }
}


export default DateInputPane;
