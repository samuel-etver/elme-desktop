
import React from 'react';
import './NotificationPane.css'
import Clock from './Clock';
import AlertStorage from '../AlertsStorage';
import MainEventManager from '../../common/MainEventManager';

let alertsStorage = AlertStorage.getInstance();
let mainEventManager = MainEventManager.getInstance();

class NotificationPane extends React.Component {
    constructor(props) {
        super(props);
        this.timerId = undefined;
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        mainEventManager.subscribe('app-load', this.onAppLoad);
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
    }


    onAppClose() {
        mainEventManager.unsubscribe('app-close', this.onAppClose);
    }


    render() {
        return <div class="notification-pane">
                  <Clock />
                  <div class="notiication-horizontal-divider" />
               </div>
    }
}

export default NotificationPane;
