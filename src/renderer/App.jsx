

import React from 'react';
import './App.css';
import RtValuesPage from './components/RtValuesPage';
import RtChartsPage from './components/RtChartsPage';
import ArchivePage from './components/ArchivePage';
import MarkupPage from './components/MarkupPage';
import ControlPane from './components/ControlPane';
import NotificationPane from './components/NotificationPane';
const electron = window.require('electron');
const ipc = electron.ipcRenderer;
const Constants = require('../common/Constants');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');


const globalStorage = GlobalStorage.getInstance();
const mainEventManager = MainEventManager.getInstance();
mainEventManager.subscribe('to-console', (arg1, arg2) => toConsole(arg2));


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
                    <MarkupPage   visible={isPageVisible('markup')}/>
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


function toConsole(arg) {
    ipc.send('to-console', arg);
}


export default App;
