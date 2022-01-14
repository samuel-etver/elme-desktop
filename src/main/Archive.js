const MemoryArchive = require('./MemoryArchive');
const LocalArchive = require('./LocalArchive');
const RemoteArchive = require('./RemoteArchive');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');
const Constants = require('../common/Constants');
const DeviceData = require('../common/DeviceData');
const electron = require('electron');
const ipc = electron.ipcMain;

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

let instance;

class Archive {
    constructor() {
        if ( !! instance ) {
            return instance;
        }
        this.archives = [];
        if ( Constants.memoryArchiveEnabled ) {
            this.archives.push(new MemoryArchive());
        }
        if ( Constants.localArchiveEnabled ) {
            this.archives.push(new LocalArchive());
        }
        if ( Constants.remoteArchiveEnabled ) {
            this.archives.push(new RemoteArchive());
        }

        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.timerId = undefined;
        this.onReadArchiveData = this.onReadArchiveData.bind(this);
        this.appendDataOnLoad = true;
        this.lastDeviceData = undefined;
        mainEventManager.subscribe('app-load', this.onAppLoad);
        instance = this;
    }


    onAppLoad() {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        this.timerId = setTimeout(this.onTimer, 1000);
        ipc.on('archive-data-read', this.onReadArchiveData);
    }


    onAppClose() {
        clearTimeout(this.timerId);
        mainEventManager.unsubscribe('app-close', this.onAppClose);
    }


    onTimer() {
        this.run();
        this.timerId = setTimeout(this.onTimer, 1000);
    }


    run() {
        let archives = this.archives;
        archives.forEach(a => {
            if ( !a.isOpened() ) {
                a.open();
            }
        });

        let mostRecentArchive = archives[0];
        if ( mostRecentArchive.isOpened() ) {
            if ( this.appendDataOnLoad ) {
                this.appendDataOnLoad = false;
                this.appendDummyData(mostRecentArchive);
            }
            let newDeviceData = globalStorage['deviceData'];
            if ( !newDeviceData ) {
                newDeviceData = DeviceData.now();
            }
            if ( !this.lastDeviceData || newDeviceData.id != this.lastDeviceData.id) {
                this.lastDeviceData = newDeviceData;
                mostRecentArchive.appendMeasures([newDeviceData]);
            }
        }
    }


    appendDummyData(archive) {
        let genValue =
          (baseValue) => baseValue + Math.random()*10 - 5;
        let now = Date.now();
        let n = 60*60;
        let measures = [];
        for (let i = 0; i < n; i++) {
            let deviceData = new DeviceData();
            deviceData.date = new Date(now - (n-i)*1000);
            deviceData.inductorTemperature1 = genValue(1000);
            deviceData.inductorTemperature2 = genValue(900);
            deviceData.thermostatTemperature1 = genValue(800);
            deviceData.thermostatTemperature2 = genValue(700);
            deviceData.sprayerTemperature = genValue(600);
            deviceData.heatingTemperature = genValue(500);
            deviceData.waterFlow = genValue(150);
            measures.push(deviceData);
        }
        archive.appendMeasures(measures);
    }


    onReadArchiveData(event, options) {
        let dateFromInt = options.dateFrom.getTime();
        let dateToInt   = options.dateTo.getTime();
        let interval    = options.interval;
        let measureParameterId = options.measureParamerId;

        let archives = this.archives;
        let searchArchives = [];
        for (let i = 0; i < archives.length; i++) {
            let currArchive = archives[i];
            if ( !currArchive.isOpened() ) {
                break;
            }
            if ( !currArchive.dateFrom ) {
                continue;
            }
            let currArchiveDateFromInt = currArchive.dateFrom.getTime();
            if ( dateToInt >= currArchiveDateFromInt ) {
                searchArchives.push(currArchive);
            }
            if ( dateFromInt >= currArchiveDateFromInt ) {
                break;
            }
        }

        if ( searchArchives.length == 0 ) {
            return;
        }

        let allData = [];
        let allDataCount = 0;
        searchArchives.forEach(() => allData.push ( undefined ));

        let read = function(index) {
            archives[index].read(options.dateFrom, options.dateTo, (result, data) => {
                allData[index] = result === 'success' ? data : null;
                if ( allData.length == ++allDataCount) {
                    globalStorage.mainWindow.send('archive-data-ready', joinData());
                }
            });
        };

        function joinData() {
            return {
                measures: allData[0],
                interval: interval,
                measureParamerId: measureParameterId
            };
        }

        searchArchives.forEach((archive, index) => read(index));
    }
}


(function() {
    new Archive();
})();


module.exports = {
    getInstance: () => instance
}
