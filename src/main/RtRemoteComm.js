const MainEventManager = require('./../common/MainEventManager');
const GlobalStorage = require('./../common/GlobalStorage');
const Constants = require('./../common/Constants');
const axios = require('axios');

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

let instance;

function getServerUrl (path) {
    let config = globalStorage.config;
    return 'http://' + config.serverIp + ':' + config.serverPort + '/' + path;
}


class RtRemoteComm {
    constructor () {
        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onPingTimer = this.onPingTimer.bind(this);
        this.onSendRtValuesTimer = this.onSendRtValuesTimer.bind(this);
        this.onSendAlertsTimer = this.onSendAlertsTimer.bind(this);
        mainEventManager.subscribe('app-load', this.onAppLoad);
    }


    onAppLoad () {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        this.pingTimerId = setInterval(this.onPingTimer, 1000);
        this.sendRtValuesTimerId = setInterval(this.onSendRtValuesTimer, 1000);
        this.sendAlertsTimerId = setInterval(this.onSendAlertsTimer, 1000);
    }


    onAppClose () {
        mainEventManager.unsubscribe('app-close', this.onAppClose);
        clearInterval(this.pingTimerId);
        clearInterval(this.onSendRtValuesTimer);
        clearInterval(this.onSendAlertsTimer);
    }


    onPingTimer () {
        axios({
            method: 'put',
            url:  getServerUrl(Constants.serverPrefixV1 + '/ping'),
            data: {
                appId: Constants.appId
            }
        }).then(function () {
        }).catch(function () {
        }).then(function () {
        });
    }


    onSendRtValuesTimer () {
        let deviceData = globalStorage.deviceData;
        if (!deviceData) {
            return;
        }
        let data = {
            appId: Constants.appId,
            date: deviceData.date.getTime(),
            inductorTemperature1: deviceData.inductorTemperature1,
            inductorTemperature2: deviceData.inductorTemperature2,
            thermostatTemperature1: deviceData.thermostatTemperature1,
            thermostatTemperature2: deviceData.thermostatTemperature2,
            sprayerTemperature: deviceData.sprayerTemperature,
            heatingTemperature: deviceData.heatingTemperature,
            waterFlow: deviceData.waterFlow
        };

        axios({
            method: 'put',
            url:  getServerUrl(Constants.serverPrefixV1 + '/rt-values'),
            data: data
        }).then(function () {
        }).catch(function () {
        }).then(function () {
        });
    }


    onSendAlertsTimer () {
    }
};


module.exports = {
    getInstance: function () {
        if (!instance) {
            instance = new RtRemoteComm();
        }
        return instance;
    }
};
