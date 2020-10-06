import React from 'react';
import './AlertsTablo.css';
import AlertStorage from '../AlertsStorage';
import AllAlerts from '../../common/Alerts';

const alertsStorage = AlertStorage.getInstance();
const allAlerts = new AllAlerts();

class AlertsTablo extends React.Component {
    constructor() {
        super();
        this.currAlerts = [];
        this.shutterRef = React.createRef();
        this.alertIndex = 0;
        this.timerId = undefined;
        this.state = {
            message: '',
            messageAnimationIndex: 0
        };
        this.onShutterAnimationEnd = this.onShutterAnimationEnd.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.restart();
    }


    componentDidMount() {
        let shutter = this.shutterRef.current;
        shutter.addEventListener('animationend', this.onShutterAnimationEnd);
    }


    componentWillUnmount() {
        let shutter = this.shutterRef.current;
        shutter.removeEventListener('animationend', this.onShutterAnimationEnd);
    }


    onShutterAnimationEnd() {
        if (++this.alertIndex >= this.currAlerts.length) {
            this.restart();
        }
        else {
            this.animateNext();
        }
    }


    restart() {
        clearTimeout(this.timerId);
        this.timerId = undefined;
        this.alertIndex = 0;
        this.currAlerts = alertsStorage.getAlerts();
        if (!this.currAlerts.length) {
            this.timerId = setTimeout(this.onTimer, 1000);
        }
        else {
            this.animateNext();
        }
    }


    animateNext() {
        let item = this.currAlerts[this.alertIndex];
        let message = allAlerts.byId(item.id).text;
        this.setState(oldState => {
            let newState = Object.assign({}, oldState);
            newState.message = message;
            newState.messageAnimationIndex = oldState.messageAnimationIndex ? 0 : 1;
            return newState;
        });
    }


    onTimer() {
        this.restart();
    }


    render() {
        let message = this.state.message;
        let shutterAnimation = !message
          ? 'none'
          : 'tablo-shutter-move' + this.state.messageAnimationIndex;
        return  <div class="alerts-tablo">
                    <div class="alerts-table-message">
                        {message}
                    </div>
                    <div class="alerts-tablo-shutter"
                         style={{"animation-name": shutterAnimation}}
                         ref={this.shutterRef} />
                </div>
    }
}

export default AlertsTablo;
