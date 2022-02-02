const MainEventManager = require('./../common/MainEventManager');
const GlobalStorage = require('./../common/GlobalStorage');
const Constants = require('./../common/Constants');
const axios = require('axios');

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

let instance;

function getServerUrl (path) {
    let config = globalStorage.config;
    return 'http://' + config.serverIp + ':8000/' + path;
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
            method: 'get',
            url:  getServerUrl('ping'),
            data: {
                appIp: Constants.appId
            }
        }).then(function () {
          console.log("PING-SUCCESS");

        }).catch(function () {
          console.log("PING-ERROR");

        }).
        then(function () {
          console.log("PING");
        });
    }


    onSendRtValuesTimer () {
        console.log("RT-VALUES");
        let deviceData = globalStorage.deviceData;
    }


    onSendAlertsTimer () {
        console.log("RT-ALERTS");
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
