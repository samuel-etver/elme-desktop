import React from 'react';
import './AlertsDropdown.css';


class AlertsDropdown extends React.Component {
    constructor() {
        super();
        this.onCloseClick = this.onCloseClick.bind(this);
    }


    onCloseClick() {

    }


    render() {
        return  <div class="alerts-dropdown">
                    <div class="alerts-dropdown-button" />
                    <div class="alerts-dropdown-image" />
                    <div class="alerts-dropdown-container">
                        <div class="alerts-dropdown-header">
                            <div class="alerts-dropdown-column-date">Дата</div>
                            <div class="alerts-dropdown-column-time">Время</div>
                            <div class="alerts-dropdown-column-alert">
                                <div class="alerts-dropdown-column-alert-text">Сообщения</div>
                                <div class="alerts-dropdown-close"></div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default AlertsDropdown;
