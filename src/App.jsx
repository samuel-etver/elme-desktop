import React from 'react';
import './App.css';
import RtValuesPage from './components/RtValuesPage';
import ControlPane from './components/ControlPane';
const electron = window.require('electron');
const ipc = electron.ipcRenderer;
const Constants = require('./Constants');
const MainEventManager = require('./MainEventManager');

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <ControlPane />
                <RtValuesPage />
            </div>
        );
    }

    componentDidMount() {
        window.onload = onLoad;
    }
}

function log(arg) {
    ipc.send('log', arg);
}

function onLoad() {
    ipc.on('device-data-ready', (event, arg) => onDeviceDataReady(arg));
}

function onDeviceDataReady(deviceData) {
    log(deviceData.inductorTemperature1);
}

export default App;
