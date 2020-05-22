

import React from 'react';
import './App.css';
import RtValuesPage from './components/RtValuesPage';
import ControlPane from './components/ControlPane';
import NotificationPane from './components/NotificationPane';
const electron = window.require('electron');
const ipc = electron.ipcRenderer;
const Constants = require('../common/Constants');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');


const globalStorage = GlobalStorage.getInstance();
const mainEventManager = MainEventManager.getInstance();


class App extends React.Component {
    constructor(props) {
        super(props);
        super.onControlPaneButtonClick = this.onControlPaneButtonClick.bind(this);
    }


    render() {
        return (
            <div className="App">
                <NotificationPane />
                <ControlPane />
                <RtValuesPage />
            </div>
        );
    }


    componentDidMount() {
        window.onload = onLoad;
        mainEventManager.subscribe('control-pane-button-click', this.onControlPaneButtonClick);
    }


    componentWillUnmount() {
        mainEventManager.unsubscribe('control-pane-button-click', this.onControlPaneButtonClick);
    }


    onControlPaneButtonClick(event, type) {
        log(type);
        mainEventManager.publish('control-pane-button-select', type);
    }
}


function log(arg) {
    ipc.send('log', arg);
}


function onLoad() {
    ipc.on('device-data-ready', (event, arg) => onDeviceDataReady(arg));
}


function onDeviceDataReady(deviceData) {
    globalStorage['deviceData'] = deviceData;
    mainEventManager.publish('rt-device-data-ready');
//    log(deviceData.inductorTemperature1);
}

export default App;
