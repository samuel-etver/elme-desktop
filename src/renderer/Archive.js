import MainEventManager from '../common/MainEventManager';
import MeasureParameters from '../common/MeasureParameters';
import ChartDataPacker from '../common/ChartDataPacker';
const electron = window.require('electron');
const ipc = electron.ipcRenderer;

let mainEventManager = MainEventManager.getInstance();
let measureParameters = new MeasureParameters();
let chartDataPacker = ChartDataPacker.getInstance();

let instance;

class Archive {
    constructor () {
        if (!instance) {
            instance = this;
            this.packetId = 0;
            this.onAppLoad = this.onAppLoad.bind(this);
            this.onAppClose = this.onAppClose.bind(this);
            this.onArchiveDataRead = this.onArchiveDataRead.bind(this);
            this.onArchiveDataReady = this.onArchiveDataReady.bind(this);
            mainEventManager.subscribe('app-load', this.onAppLoad);
        }
        return instance;
    }


    onAppLoad () {
        mainEventManager.unsubscribe('app-load', this.onAppLoad);
        mainEventManager.subscribe('app-close', this.onAppClose);
        mainEventManager.subscribe('archive-data-read', this.onArchiveDataRead);
        ipc.on('archive-data-ready', this.onArchiveDataReady);
    }


    onAppClose () {
        mainEventManager.unsubscribe('app-close', this.onAppClose);
        mainEventManager.unsubscribe('archive-data-read', this.onArchiveDataRead);
    }


    onArchiveDataRead (event, options) {
        ++this.packetId;
        ipc.send('archive-data-read', {
            dateFrom: options.dateFrom,
            dateTo: options.dateTo,
            interval: options.interval,
            measureParameterId: options.measureParameterId,
            id: this.packetId
        });
    }


    onArchiveDataReady (event, arg) {
        if (arg.packedArchivedData === undefined) {
            let interval = arg.interval;
            let measureParameterId = arg.measureParameterId;
            let measureParameterName = measureParameters.byId(measureParameterId).name;
            let measures = arg.measures;
            let xs  = measures['date'];
            let ys  = measures[measureParameterName];
            let data = chartDataPacker.pack(Array.from(xs, (x, i) => [x, ys[i]]), interval);
            arg.packedArchiveData = data;
        }

        mainEventManager.publish('archive-data-ready', arg);
    }
}


(function () {
    new Archive();
})();


export default Archive = {
    getInstance: () => instance,
}
