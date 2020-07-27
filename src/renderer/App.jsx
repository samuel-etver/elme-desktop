

import React from 'react';
import './App.css';
import RtValuesPage from './components/RtValuesPage';
import RtChartsPage from './components/RtChartsPage';
import ArchivePage from './components/ArchivePage';
import ControlPane from './components/ControlPane';
import NotificationPane from './components/NotificationPane';
const electron = window.require('electron');
const ipc = electron.ipcRenderer;
const Constants = require('../common/Constants');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');


const globalStorage = GlobalStorage.getInstance();
const mainEventManager = MainEventManager.getInstance();
mainEventManager.subscribe('log', onLog);


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activatePage: 'rt-values',
        }
        this.onControlPaneButtonClick = this.onControlPaneButtonClick.bind(this);
    }


    render() {
        let isPageVisible = type => {
            return this.state.activatePage === type;
        }

        return (
            <div className="App">
                <NotificationPane />
                <ControlPane />
                <div>
                    <RtValuesPage visible={isPageVisible('rt-values')}/>
                    <RtChartsPage visible={isPageVisible('rt-charts')}/>
                    <ArchivePage  visible={isPageVisible('archive')}/>
                </div>
            </div>
        );
    }


    componentDidMount() {
        mainEventManager.publish('app-load');
        mainEventManager.subscribe('control-pane-button-click', this.onControlPaneButtonClick);
        ipc.on('device-data-ready', (event, arg) => this.onDeviceDataReady(arg));
    }


    componentWillUnmount() {
        mainEventManager.publish('app-close');
        mainEventManager.unsubscribe('control-pane-button-click', this.onControlPaneButtonClick);
    }


    onControlPaneButtonClick(event, type) {
        mainEventManager.publish('page-selected', type);
        this.setState({
            activatePage: type
        });
    }


    onDeviceDataReady(deviceData) {
        globalStorage['deviceData'] = deviceData;
        mainEventManager.publish('rt-device-data-ready');
    }
}


function onLog(arg1, arg2) {
    log(arg2);
}


function log(arg) {
    ipc.send('log', arg);
}


export default App;
