import React from 'react';
import './Clock.css';
import Constants from '../../common/Constants';

class Clock extends React.Component {
    constructor() {
        super();
        this.onTimer = this.onTimer.bind(this);
        this.state = {
            date: new Date(),
            counter: 0
        }
    }


    componentDidMount() {
        this.timerId = setInterval(this.onTimer, 500);
    }


    componentWillUnmount() {
        clearInterval(this.timerId);
    }


    onTimer() {
        this.setState(oldState => {
            return {
                date: new Date(),
                counter: oldState.counter + 1
            };
        });
    }


    render() {
        let dt = this.state.date;

        let intTo02 = value => (value < 10 ? '0' : '') + value;
        let timeDivider = (this.state.counter & 1) ? '' : ':';
        let dateStr = dt.getDate() + " " +
                      Constants.monthsGenetive[dt.getMonth()] + " " +
                      dt.getFullYear();


        return <div class="clock">
                  <div class="clock-time">
                    <div>{intTo02(dt.getHours())}</div>
                    <div class="clock-time-divider">{timeDivider}</div>
                    <div>{intTo02(dt.getMinutes())}</div>
                    <div class="clock-time-divider">{timeDivider}</div>
                    <div>{intTo02(dt.getSeconds())}</div>
                  </div>
                  <div class="clock-date">
                    {dateStr}
                  </div>
               </div>
    }
}

export default Clock;
