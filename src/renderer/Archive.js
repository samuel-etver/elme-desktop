import MainEventManager from '../common/MainEventManager';
import GlobalStorage from '../common/GlobalStorage';
import MeasureParameters from './MeasureParameters';
const electron = window.require('electron');
const ipc = electron.ipcRenderer;

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();
let measureParameters = new MeasureParameters();

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
            measureParamerId: options.measureParameterId,
            id: this.packetId
        });
    }


    onArchiveDataReady (event, arg) {
        let measures = arg.measures;
        let xs  = measures['date'];
        /*let ys  = measures[measureParameter.name];
        data = this.packData(Array.from(xs, (x, i) => [x, ys[i]]));*/

        mainEventManager.publish('archive-data-ready', arg);
    }


    packData (data) {
        let interval = this.getInterval();

        if (!interval || !data || data.length < 1000) {
            return data;
        }

        let result = [];

        let dt0 = new Date(data[0][0].getTime());
        dt0.setMilliseconds(0);
        dt0.setSeconds(0);
        dt0.setMinutes(2*(dt0.getMinutes() >> 1));
        let dt0Int = dt0.getTime();

        let dt1 = data[data.length - 1][0];
        let dt1Int = dt1.getTime();


        let index = 0;

        while (dt0Int <= dt1Int) {
            let dtNextInt = dt0Int + interval;

            let minY;
            let maxY;
            let minIndex;
            let maxIndex
            let dotCount = 0;

            for(; index < data.length; index++) {
                let [x, y] = data[index];
                if (x.getTime() >= dtNextInt) {
                    break;
                }
                dotCount++;
                if (y !== undefined) {
                    if (minY === undefined) {
                        minY = y;
                        maxY = y;
                    }
                    else {
                        if (minY > y) {
                            minY = y;
                            minIndex = index;
                        }
                        if (maxY < y) {
                            maxY = y;
                            maxIndex = index;
                        }
                    }
                }
            }

            if (dotCount) {
                if (minIndex === undefined) {
                    result.push(data[index - 1]);
                }
                else {
                    if (dotCount === 1 || minIndex === maxIndex) {
                        result.push(data[minIndex]);
                    }
                    else {
                        if (minIndex < maxIndex ) {
                            result.push(data[minIndex], data[maxIndex]);
                        }
                        else {
                            result.push(data[maxIndex], data[minIndex]);
                        }
                    }
                }
            }

            dt0Int = dtNextInt;
        }

        return result;
    }
}


(function() {
    new Archive();
})();


export default Archive = {
    getInstance: () => instance,
}
