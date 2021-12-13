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
        this.state = {
            message: '',
        };
        this.onShutterAnimationEnd = this.onShutterAnimationEnd.bind(this);
    }


    componentDidMount() {
        let shutter = this.shutterRef.current;
        shutter.addEventListener('animationiteration', this.onShutterAnimationEnd);
    }


    componentWillUnmount() {
        let shutter = this.shutterRef.current;
        shutter.removeEventListener('animationiteration', this.onShutterAnimationEnd);
    }


    onShutterAnimationEnd() {
        this.animateNext();
    }


    animateNext() {
        if (++this.alertIndex >= this.currAlerts.length) {
            this.alertIndex = 0;
            this.currAlerts = alertsStorage.getAlerts();
        }
        if (this.currAlerts.length) {
            let item = this.currAlerts[this.alertIndex];
            var message = allAlerts.byId(item.id).text;
        }
        this.setState({
            message: message ?? '',
        });
    }


    render() {
        return  <div class="alerts-tablo">
                    <div class="alerts-tablo-shutter"
                         ref={this.shutterRef} />
                    <div class="alerts-table-message">
                        {this.state.message}
                    </div>
                </div>;
    }
}

export default AlertsTablo;
