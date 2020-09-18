
import React from 'react';
import './NotificationPane.css'
import Clock from './Clock';
import AlertsTablo from './AlertsTablo';

class NotificationPane extends React.Component {
    render() {
        return <div class="notification-pane">
                  <Clock />
                  <div class="notiication-horizontal-divider" />
                  <AlertsTablo />
               </div>
    }
}

export default NotificationPane;
