

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
        super.onControlPaneButtonClick = this.onControlPaneButtonClick.bind(this);
    }


    render() {
        let getPageStyle = type => {
            let page = this.state.activatePage;
            if ( page === type ) {
                return 'front-page';
            }
            return 'back-page hidden';
        }

        let valuesPageStyle = getPageStyle('rt-values');
        let chartsPageStyle = getPageStyle('rt-charts');
        let archivePageStyle = getPageStyle('archive');

        return (
            <div className="App">
                <NotificationPane />
                <ControlPane />
                <div>
                    <RtValuesPage style={valuesPageStyle}/>
                    <RtChartsPage style={chartsPageStyle}/>
                    <ArchivePage  style={archivePageStyle}/>
                </div>
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
        mainEventManager.publish('page-selected', type);
        this.setState({
            activatePage: type
        });
    }
}


function onLog(arg1, arg2) {
    log(arg2);
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
}


export default App;
