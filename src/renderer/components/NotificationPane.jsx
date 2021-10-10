
import React from 'react';
import './NotificationPane.css'
import Clock from './Clock';
import AlertsTablo from './AlertsTablo';
import AlertsDropdown from './AlertsDropdown';

function NotificationPane () {
    return <div class="notification-pane">
              <Clock />
              <div class="notiication-horizontal-divider1" />
              <AlertsTablo />
              <div class="notiication-horizontal-divider2" />
              <AlertsDropdown />
           </div>
}

export default NotificationPane;
