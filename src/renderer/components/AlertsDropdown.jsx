import React from 'react';
import './AlertsDropdown.css';
import AlertsStorage from '../AlertsStorage';
import Calendar from '../../common/Calendar'
import AllAlerts from '../../common/Alerts'

const alertsStorage = AlertsStorage.getInstance();
const allAlerts = new AllAlerts();


class AlertsDropdown extends React.Component {
    constructor () {
        super();
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onToggleClick = this.onToggleClick.bind(this);
        this.state = {
            visible: false,
            alerts: undefined
        }
    }


    componentDidMount () {
        this.timerId = setInterval(this.onTimer.bind(this), 1000);
    }


    componentWillUnmount () {
        clearInterval(this.timerId);
    }


    onTimer () {
        let newAlerts = AlertsStorage.getInstance().getAlerts();
        let oldAlerts = this.state.alerts;

        if (!alertsStorage.isAlertsSame(newAlerts, oldAlerts)) {
            this.setState(oldState => {
                let newState = Object.assign({}, oldState);
                newState.alerts = newAlerts;
                return newState;
            });
        }
    }


    onCloseClick () {
        this.setListVisible(false);
    }


    setListVisible (visible) {
        this.setState(oldState => {
            let newState = Object.assign({}, oldState);
            newState.visible = visible;
            return newState;
        });
    }


    onToggleClick () {
        this.setListVisible(!this.state.visible);
    }


    render () {
        if (this.state.visible) {
            let alerts = this.state.alerts;
            if (alerts && alerts.length) {
                var alertsRows = alerts.map(item => {
                    let dt = Calendar.timeToStr(item.date);
                    let tm = Calendar.dateToStr(item.date);
                    let msg = allAlerts.byId(item.id).text;
                    return <div class="alerts-dropdown-row">
                              <div class="alerts-dropdown-cell alerts-dropdown-cell-date">{dt}</div>
                              <div class="alerts-dropdown-cell alerts-dropdown-cell-time">{tm}</div>
                              <div class="alerts-dropdown-cell alerts-dropdown-cell-alert">{msg}</div>
                           </div>;
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
              </div>;
        }

        return  <div class="alerts-dropdown">
                    <div class="alerts-dropdown-button" onClick={this.onToggleClick} />
                    <div class="alerts-dropdown-image" />
                    {dropdownContainer}
                </div>;
    }
}

export default AlertsDropdown;
