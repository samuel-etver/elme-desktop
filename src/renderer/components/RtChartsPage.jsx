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
        this.eventManager = new EventManager();
        this.prefix = 'rt-charts-page-';
        this.measureParameters = new MeasureParameters();
        let measureParameter = this.measureParameters.get('inductorTemperature1');
        let chartBuildOptions = (new ChartBuilder).buildOptions({
            measureParameter: measureParameter
        });
        this.state = {
            selectedMeasureParameterId: measureParameter.id,
            options: chartBuildOptions,
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
        this.eventManager.subscribe(this.prefix + 'number-button-click', this.onChartNumberButtonClick);
        this.eventManager.subscribe(this.prefix + 'combobox-select', this.onChartSelect);
        this.eventManager.subscribe(this.prefix + 'update', this.onUpdate);
        mainEventManager.subscribe('rt-device-data-ready', this.onRtDeviceDataReady);
        this.timerId = setTimeout(this.onTimer, Constants.rtChartRecordInterval*1000);
    }


    componentWillUnmount() {
        this.eventManager.unsubscribe(this.prefix + 'number-button-click', this.onChartNumberButtonClick);
        this.eventManager.unsubscribe(this.prefix + 'combobox-select', this.onChartSelect);
        this.eventManager.unsubscribe(this.prefix + 'update', this.onUpdate);
        mainEventManager.unsubscribe('rt-device-data-ready', this.onRtDeviceDataReady);
        clearTimeout(this.timerId);
    }


    onRtDeviceDataReady() {
        this.rtDeviceData = globalStorage['deviceData'];
    }


    onTimer() {
        let rtDeviceData = this.rtDeviceData;
        if ( !rtDeviceData ) {
            rtDeviceData = DeviceData.now();
            this.rtDeviceData = rtDeviceData;
        }
        this.appendChartData(rtDeviceData);

        this.eventManager.publish(this.prefix + 'update');

        this.timerId = setTimeout(this.onTimer, Constants.rtChartRecordInterval*1000);
    }


    appendChartData(newItem) {
        let lastItem = this.chartData[this.chartData.length - 1];
        if ( !lastItem || lastItem.id != newItem.id ) {
            this.chartData.push( newItem );
        }
    }


    buildSeries(id) {
        let series = [];
        let data = [];
        let measureParameter = this.measureParameters.byId(id);
        for (let item of this.chartData) {
            data.push( [item.date, item[measureParameter.name]] );
        }
        series.push({
            type: 'line',
            data: data
        });
        return series;
    }


    onUpdate(event, id) {
        if ( !id ) {
            id = this.state.selectedMeasureParameterId;
        }

        let measureParameter = this.measureParameters.byId(id);
        let options = (new ChartBuilder).buildOptions({
            measureParameter: this.measureParameters.get(measureParameter.name)
        });

        this.setState({
            selectedMeasureParameterId: id,
            options: options
        });
    }


    render() {
        let style = 'rt-charts-page ';
        if ( this.props.style ) {
            style += this.props.style;
        }
        let chartCaptionOptions = {
            prefix: this.prefix,
            selectedId: this.state.selectedMeasureParameterId,
            eventManager: this.eventManager
        };
        let chartNumberButtonsGroupOptions = {
            prefix: this.prefix,
            count: this.measureParameters.size(),
            eventManager: this.eventManager
        };
        let chartOptions = this.state.options;
        let series = this.buildSeries(this.state.selectedMeasureParameterId);
        chartOptions.series = series;

        return  <div class={style}>
                      <MeasureParametersComboBox options={chartCaptionOptions}/>
                      <HorzDivider height="40px" />
                      <div class="rt-charts-page-chart-pane">
                          <Chart options={chartOptions}/>
                      </div>
                      <HorzDivider height="20px" />
                      <NumberButtonsGroup options={chartNumberButtonsGroupOptions}/>
                </div>
    }


    onChartNumberButtonClick(event, index) {
        let parameter = this.measureParameters.byIndex(index);
        this.eventManager.publish(this.prefix + 'update', parameter.id);
    }


    onChartSelect(event, id) {
        this.eventManager.publish(this.prefix + 'update', id);
    }
}

export default RtChartsPage;
