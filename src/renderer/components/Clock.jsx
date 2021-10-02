import React from 'react';
import './Clock.css';
import Constants from '../../common/Constants';

class Clock extends React.Component {
    constructor (props) {
        super(props);
        this.state = this.createNewState();
    }


    componentDidMount () {
        this.timerId = setInterval(this.onTimer.bind(this), 500);
    }


    componentWillUnmount () {
        clearInterval(this.timerId);
    }


    createNewState () {
        function intTo02 (value) {
            return (value < 10 ? '0' : '') + value;
        }

        let dt = new Date();
        let seconds = dt.getSeconds();
        let timeDivider = (seconds & 1) ? '' : ':';
        let dateStr = dt.getDate() + " " +
                      Constants.monthsGenetive[dt.getMonth()] + " " +
                      dt.getFullYear();

        return {
            date: dateStr,
            hour: intTo02(dt.getHours()),
            min: intTo02(dt.getMinutes()),
            sec: intTo02(seconds),
            timeDivider: timeDivider,
        };
    }


    onTimer () {
        let newState = this.createNewState();
        this.setState(newState);
    }


    renderTimeDivider () {
        return <div class="clock-time-divider">{this.state.timeDivider}</div>;
    }


    renderTimeValue (value) {
        return <div class="clock-time-value">{this.state[value]}</div>;
    }


    render () {
        return <div class="clock">
                  <div class="clock-time">
                      {this.renderTimeValue('hour')}
                      {this.renderTimeDivider()}
                      {this.renderTimeValue('min')}
                      {this.renderTimeDivider()}
                      {this.renderTimeValue('sec')}
                  </div>
                  <div class="clock-date">
                      {this.state.date}
                  </div>
               </div>;
    }
}

export default Clock;
