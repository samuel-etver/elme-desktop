import React from 'react';
import './AlertsDropdown.css';
import MainEventManager from '../../common/MainEventManager';
import AlertsStorage from '../AlertsStorage';

let mainEventManager = MainEventManager.getInstance();
let alertsStorage = AlertsStorage.getInstance();


class AlertsDropdown extends React.Component {
    constructor() {
        super();
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onToggleClick = this.onToggleClick.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.state = {
            visible: false,
            alerts: undefined
        }
    }


    componentDidMount() {
        setInterval(this.onTimer, 1000);
    }


    componentWillUnmount() {
        clearInterval(this.onTimer);
    }


    onTimer() {
        let newAlerts = AlertsStorage.getInstance().getAlerts();
        let oldAlerts = this.state.alerts;

        let isAlertsSame = function(alerts1, alerts2) {
            return alertsStorage.isAlertsSame(alerts1, alerts2);
        }

        if (!isAlertsSame(newAlerts, oldAlerts)) {
            this.setState(oldState => {
                let newState = Object.assign({}, oldState);
                newState.alerts = newAlerts;
                return newState;
            });
        }
    }


    onCloseClick() {
        this.setListVisible(false);
    }


    setListVisible(visible) {
        this.setState(oldState => {
            let newState = Object.assign({}, oldState);
            newState.visible = visible;
            return newState;
        });
    }


    onToggleClick() {
        this.setListVisible(!this.state.visible);
    }


    render() {
        if (this.state.visible) {
            let alerts = this.state.alerts;
            alerts = [11, 22, 33];
            if (alerts && alerts.length) {
                var alertsRows = alerts.map((item) => {
                    return <div class="alerts-dropdown-row">{item.toString()}
                           </div>
                });
            }

            var dropdownContainer =
              <div class="alerts-dropdown-container">
                  <div class="alerts-dropdown-header">
                      <div class="alerts-dropdown-column-date">Дата</div>
                      <div class="alerts-dropdown-column-time">Время</div>
                      <div class="alerts-dropdown-column-alert">
                          <div class="alerts-dropdown-column-alert-text">Сообщения</div>
                          <div class="alerts-dropdown-close" onClick={this.onCloseClick}></div>
                      </div>
                  </div>
                  {alertsRows}
              </div>
        }

        return  <div class="alerts-dropdown">
                    <div class="alerts-dropdown-button" onClick={this.onToggleClick} />
                    <div class="alerts-dropdown-image" />
                    {dropdownContainer}
                </div>
    }
}

export default AlertsDropdown;
