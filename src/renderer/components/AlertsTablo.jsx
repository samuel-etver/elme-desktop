import React from 'react';
import './AlertsTablo.css';
import AlertStorage from '../AlertsStorage';
import MainEventManager from '../../common/MainEventManager';

let alertsStorage = AlertStorage.getInstance();
let mainEventManager = MainEventManager.getInstance();

class AlertsTablo extends React.Component {
    constructor() {
        super();
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        mainEventManager.subscribe('app-load', this.onAppLoad);
    }


    componentDidMount() {
    }


    componentWillUnmount() {
    }


onAppLoad() {
    mainEventManager.unsubscribe('app-load', this.onAppLoad);
    mainEventManager.subscribe('app-close', this.onAppClose);
}


onAppClose() {
    mainEventManager.unsubscribe('app-close', this.onAppClose);
}


    render() {
        return  <div class="alerts-tablo">
                    <div class="alerts-table-message">This is alert!</div>
                    <div class="alerts-tablo-shutter" />
                </div>
    }
}

export default AlertsTablo;
