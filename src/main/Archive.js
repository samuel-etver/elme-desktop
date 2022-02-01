const MemoryArchive = require('./MemoryArchive');
const LocalArchive = require('./LocalArchive');
const RemoteArchive = require('./RemoteArchive');
const MainEventManager = require('../common/MainEventManager');
const GlobalStorage = require('../common/GlobalStorage');
const Constants = require('../common/Constants');
const DeviceData = require('../common/DeviceData');
const MeasureParameters = require('../common/MeasureParameters');
const ChartDataPacker = require('../common/ChartDataPacker');
const DummyArchiveDataGenerator = require('./DummyArchiveDataGenerator');
const electron = require('electron');
const ipc = electron.ipcMain;

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();
let chartDataPacker = ChartDataPacker.getInstance();
let measureParameters = new MeasureParameters();
let dummyArchiveDataGenerator;
if (DummyArchiveDataGenerator) {
    dummyArchiveDataGenerator = new DummyArchiveDataGenerator();
}

let instance;

class Archive {
    constructor () {
        if (!!instance) {
            return instance;
        }
        this.archives = [];
        if (Constants.memoryArchiveEnabled) {
            this.memoryArchive = new MemoryArchive();
            this.archives.push(this.memoryArchive);
        }
        if (Constants.localArchiveEnabled) {
            this.localArchive = new LocalArchive();
            this.archives.push(this.localArchive);
        }
        if (Constants.remoteArchiveEnabled) {
            this.remoteArchive = new RemoteArchive();
            this.archives.push(this.remoteArchive);
        }

        this.onAppLoad = this.onAppLoad.bind(this);
        this.onAppClose = this.onAppClose.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.timerId = undefined;
        this.onReadArchiveData = this.onReadArchiveData.bind(this);
        this.lastDeviceData = undefined;
        mainEventManager.subscribe('app-load', this.onAppLoad);
        instance = this;
    }


    open () {
        let onOpen = function (result) {
            if (result === 'success' && dummyArchiveDataGenerator) {
                let dummyMeasures = dummyArchiveDataGenerator.getMeasures();
            }
        };
        this.archives.forEach(a => a.open(onOpen));
    }


    onAppLoad () {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        this.open();
        this.timerId = setTimeout(this.onTimer, 1000);
        ipc.on('archive-data-read', this.onReadArchiveData);
    }


    onAppClose () {
        clearTimeout(this.timerId);
        mainEventManager.unsubscribe('app-close', this.onAppClose);
    }


    onTimer () {
        this.run();
        this.timerId = setTimeout(this.onTimer, 1000);
    }


    run () {
        let archives = this.archives;

        let mostRecentArchive = archives[0];
        if (mostRecentArchive.isOpened()) {
            let newDeviceData = globalStorage['deviceData'];
            if (!newDeviceData) {
                newDeviceData = DeviceData.now();
            }
            if (!this.lastDeviceData || newDeviceData.id != this.lastDeviceData.id) {
                this.lastDeviceData = newDeviceData;
                mostRecentArchive.appendMeasures([newDeviceData]);
            }
        }
    }


    onReadArchiveData (event, options) {
        let dateFromInt = options.dateFrom.getTime();
        let dateToInt   = options.dateTo.getTime();
        let interval    = options.interval;
        let measureParameterId = options.measureParameterId;

        let archives = this.archives;
        let searchArchives = [];
        for (let i = 0; i < archives.length; i++) {
            let currArchive = archives[i];
            if (!currArchive.isOpened()) {
                break;
            }
            if (!currArchive.getDateFrom()) {
                continue;
            }
            let currArchiveDateFromInt = currArchive.getDateFrom().getTime();
            if (dateToInt >= currArchiveDateFromInt) {
                searchArchives.push(currArchive);
            }
            if (dateFromInt >= currArchiveDateFromInt) {
                break;
            }
        }

        if (searchArchives.length == 0) {
            return;
        }

        let allData = [];
        let allDataCount = 0;
        searchArchives.forEach(() => allData.push (undefined));

        let read = function(index) {
            archives[index].read(options.dateFrom, options.dateTo, (result, data) => {
                allData[index] = result === 'success' ? data : null;
                if (allData.length == ++allDataCount) {
                    globalStorage.mainWindow.send('archive-data-ready', joinData());
                }
            });
        };

        function joinData () {
            let measureParameterName = measureParameters.byId(measureParameterId).name;
            let measures = allData[0];
            let xs  = measures['date'];
            let ys  = measures[measureParameterName];
            let data = chartDataPacker.pack(Array.from(xs, (x, i) => [x, ys[i]]), interval);
            return {
                //measures: measures,
                interval: interval,
                measureParameterId: measureParameterId,
                packedArchiveData: data
            };
        }

        searchArchives.forEach((archive, index) => read(index));
    }
}


(function () {
    new Archive();
})();


module.exports = {
    getInstance: () => instance
}
