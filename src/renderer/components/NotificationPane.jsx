
import React from 'react';
import './NotificationPane.css'
import Clock from './Clock';
import AlertsTablo from './AlertsTablo';
import AlertsDropdown from './AlertsDropdown';

class NotificationPane extends React.Component {
    render() {
        return <div class="notification-pane">
                  <Clock />
                  <div class="notiication-horizontal-divider" />
                  <AlertsTablo />
                  <AlertsDropdown />
               </div>
    }
}

export default NotificationPane;
