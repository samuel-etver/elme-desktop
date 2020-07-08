import React from 'react';
import './RtChartsPage.css';
import './MeasureParametersComboBox';
import MeasureParametersComboBox from './MeasureParametersComboBox';
import NumberButtonsGroup from './NumberButtonsGroup';
import HorzDivider from './HorzDivider';
import Constants from '../../common/Constants';
import MeasureParameters from '../MeasureParameters';
import DeviceData from '../../common/DeviceData';
import EventManager from '../../common/EventManager';
import MainEventManager from '../../common/MainEventManager';
import GlobalStorage from '../../common/GlobalStorage';
import ChartBuilder from '../ChartBuilder';
import Chart from './Chart';

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

class RtChartsPage extends React.Component {
    constructor(props) {
        super(props);
        this.prefix = 'rt-charts-page-';
        this.measureParameters = new MeasureParameters();
        this.eventManager = new EventManager();
        this.chartBuilder = new ChartBuilder();
        let measureParameter = this.measureParameters.get('inductorTemperature1');
        this.state = {
            count: 0,
            selectedMeasureParameterId: measureParameter.id,
        };
        this.rtDeviceData = null;
        this.chartData = [];
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
        this.onChartSelect = this.onChartSelect.bind(this);
        this.onRtDeviceDataReady = this.onRtDeviceDataReady.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.timerId = null;
    }


    componentDidMount() {
        this.eventManager.subscribe(this.prefix + 'update', this.onUpdate);
        mainEventManager.subscribe('rt-device-data-ready', this.onRtDeviceDataReady);
        this.timerId = setTimeout(this.onTimer, Constants.rtChartRecordInterval*1000);
    }


    componentWillUnmount() {
        this.eventManager.unsubscribe(this.prefix + 'update', this.onUpdate);
        mainEventManager.unsubscribe('rt-device-data-ready', this.onRtDeviceDataReady);
        clearTimeout(this.timerId);
    }


    onRtDeviceDataReady() {
        this.rtDeviceData = globalStorage['deviceData'];
    }


    onTimer() {
        let newItem = this.rtDeviceData;
        let lastItem = this.chartData[this.chartData.length - 1];
        if ( !newItem || !lastItem || lastItem.id == newItem.id) {
            newItem = DeviceData.now();
            this.rtDeviceData = newItem;
        }
        this.appendChartData(newItem);
        this.removeChartData(newItem.date);

        this.eventManager.publish(this.prefix + 'update');

        this.timerId = setTimeout(this.onTimer, Constants.rtChartRecordInterval*1000);
    }


    appendChartData(newItem) {
        this.chartData.push( newItem );
    }


    removeChartData(toDate) {
        let toTimestamp = toDate.getTime();
        let fromTimestamp = toTimestamp - 1000*(Constants.rtChartPeriod + 3*60);
        this.chartData = this.chartData.filter(item =>  {
            let timestamp = item.date.getTime();
            return timestamp > fromTimestamp && timestamp <= toTimestamp;
        });
    }


    buildSeries(id) {
        let series = [];
        let data = [];
        let measureParameter = this.measureParameters.byId(id);
        for (let item of this.chartData) {
            data.push( [item.date, item[measureParameter.name]] );
        }
        let newSerie = this.chartBuilder.buildSerie({
            data: data
        });
        series.push(newSerie);
        return series;
    }


    onUpdate(event, options) {
        if (this.props.visible) {
            let id = (!options || !options.id)
              ? this.state.selectedMeasureParameterId
              : options.id;

            this.setState({
                count: this.state.count + 1,
                selectedMeasureParameterId: id,
            });
        }
    }


    onChartNumberButtonClick(index) {
        let parameter = this.measureParameters.byIndex(index);
        this.eventManager.publish(this.prefix + 'update', {
            id: parameter.id
        });
    }


    onChartSelect(event, id) {
        this.eventManager.publish(this.prefix + 'update', {
            id: id
        });
    }


    render() {
        let style = 'rt-charts-page ';
        if ( this.props.visible ) {
            style += 'front-page';
        }
        else {
            style += 'back-page hidden';
        }

        if ( !this.props.visible ) {
            return <div class={style} />
        }

        let chartOptions = this.chartBuilder.buildOptions({
            measureParameterId: this.state.selectedMeasureParameterId,
            realTime: true
        });
        chartOptions.series = this.buildSeries(this.state.selectedMeasureParameterId);

        return  <div class={style}>
                      <MeasureParametersComboBox
                        selectedId={this.state.selectedMeasureParameterId}
                        callback={this.onChartSelect}/>
                      <HorzDivider height="40px" />
                      <div class="rt-charts-page-chart-pane">
                          <Chart options={chartOptions}/>
                      </div>
                      <HorzDivider height="20px" />
                      <NumberButtonsGroup
                        count={this.measureParameters.size()}
                        callback={this.onChartNumberButtonClick}/>
                </div>
    }
}

export default RtChartsPage;
