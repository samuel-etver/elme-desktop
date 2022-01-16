import Constants from '../../common/Constants';
import XScaleParameters from './XScaleParameters';
import MainEventManager from '../../common/MainEventManager';
import MeasureParameters from '../MeasureParameters';
import ChartBuilder from '../ChartBuilder';

let mainEventManager = MainEventManager.getInstance();
let xScaleParameters = new XScaleParameters();

let ArchivePageMixin = {
    initImpl () {
        this.wasSelected = false;
        this.measureParameters = new MeasureParameters();
        this.chartBuilder = new ChartBuilder();
        let measureParameter = this.measureParameters.get('inductorTemperature1');
        this.state = {
            selectedMeasureParameterId: measureParameter.id,
            dateInputPaneData: {
                year: '',
                month: '',
                day: '',
                hour: ''
            },
            xScale: 1,
            xScrollBarPosition: 50,
            xMax: undefined,
            dataPacketCount: 0
        };
        this.archiveData = undefined;
        this.onPageSelected = this.onPageSelected.bind(this);
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
        this.onChartSelect = this.onChartSelect.bind(this);
        this.onDateInput = this.onDateInput.bind(this);
        this.onXScaleChange = this.onXScaleChange.bind(this);
        this.onXScrollBarEvent = this.onXScrollBarEvent.bind(this);
        this.onArchiveDataReady = this.onArchiveDataReady.bind(this);
        this.archiveMessageManager = {
            timerId: undefined,
            publish: function(...args) {
                clearTimeout(this.timerId);
                this.timerId = setTimeout(() => {
                    mainEventManager.publish('archive-data-read', ...args);
                }, 500);
            }
        };
        this.series = null;
        this.seriesParameterId = -1;
    },


    getInterval (xScale) {
        if (xScale === undefined) {
            xScale = this.state.xScale;
        }
        switch(xScale) {
            case 2:
                interval = 5;
                break;
            case 3:
                interval = 15;
                break;
            case 4:
                interval = 30;
                break;
            case 5:
                interval = 60;
                break;
            case 6:
                interval = 120;
                break;
            default:
                var interval = 0;
        }
        return interval * 1000;
    },


    onChartNumberButtonClickImpl (index) {
        this.setState(oldState => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = this.measureParameters.byIndex(index).id;
            return newState;
        });
    },


    onChartSelectImpl (event, id) {
        this.setState(oldState => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = id;
            return newState;
        });
    },


    onXScrollBarEventImpl (event, value) {
        let newValue;
        let xScale = this.state.xScale;
        let options = this.chartBuilder.buildXScrollBarOptions({
            xScale: xScale
        });
        let step;
        let newValueSaved;

        var validatePosition = function () {
            if (newValue < options.valueMin) {
                newValue += 50 - options.valueMin;
            }
            else if (newValue > options.valueMax) {
                newValue -= options.valueMax - 50;
            }
        };

        switch (event) {
            case 'scroll':
                newValue = value;
                newValueSaved = newValue;
                break;
            case 'stop':
                newValue = value;
                newValueSaved = newValue;
                validatePosition();
                break;
            case 'double-left':
                step = -options.doubleStep;
            case 'left':
                step = step ?? -options.step;
            case 'right':
                step = step ?? options.step;
            case 'double-right':
                step = step ?? options.doubleStep;
                newValue = this.state.xScrollBarPosition + step;
                newValueSaved = newValue;
                validatePosition();
            default: ;
        }

        if (newValue !== undefined) {
            let measureParameterId = this.state.selectedMeasureParameterId;
            let interval = this.getInterval(xScale);
            let dateTo = new Date(this.state.xMax.getTime() + (newValueSaved - this.state.xScrollBarPosition)*0.01*options.interval);
            if (dateTo.getTime() < Constants.archiveDateMin.getTime()) {
                dateTo = Constants.archiveDateMin;
            }
            this.archiveMessageManager.publish( {
                dateFrom: new Date(dateTo.getTime() - xScaleParameters.get(xScale).value*60*1000),
                dateTo: dateTo,
                interval: interval,
                measureParameterId: measureParameterId
            });
            this.setState(oldState => {
                let newState = Object.assign({}, oldState);
                newState.xScrollBarPosition = newValue;
                newState.xMax = dateTo;
                newState.dateInputPaneData.hour = dateTo.getHours();
                newState.dateInputPaneData.day = dateTo.getDate();
                newState.dateInputPaneData.month = Constants.months.capitalize(dateTo.getMonth());
                newState.dateInputPaneData.year = dateTo.getFullYear();
                return newState;
            });
        }
    },


    buildSeries (id) {
        let series = [];
        let data = [];
        let measureParameter = this.measureParameters.byId(id);
        if (this.archiveData) {
            data = this.archiveData.packedData;
        }
        let newSerie = this.chartBuilder.buildSerie({
            data: data
        });
        series.push(newSerie);
        return series;
    },


    onXScaleChange (buttonIndex) {
        let measureParameterId = this.state.selectedMeasureParameterId;
        let dateTo = this.state.xMax;
        this.setState(oldState => {
            let newState = Object.assign({}, oldState);
            newState.xScale = buttonIndex;
            return newState;
        });
        this.archiveMessageManager.publish({
            dateFrom: new Date(dateTo.getTime() - xScaleParameters.get(buttonIndex).value*60*1000),
            dateTo: dateTo,
            interval: this.getInterval(buttonIndex),
            measureParameterId: measureParameterId
        });
    },


    componentDidMountImpl () {
        mainEventManager.subscribe('page-selected', this.onPageSelected);
        mainEventManager.subscribe('archive-data-ready', this.onArchiveDataReady);
    },


    componentWillUnmountImpl () {
        mainEventManager.unsubscribe('page-selected', this.onPageSelected);
        mainEventManager.unsubscribe('archive-data-ready', this.onArchiveDataReady);
    }
};

export default ArchivePageMixin;
