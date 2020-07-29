import React from 'react';
import './RtChartsPage.css';
import './MeasureParametersComboBox';
import MeasureParametersComboBox from './MeasureParametersComboBox';
import NumberButtonsGroup from './NumberButtonsGroup';
import HorzDivider from './HorzDivider';
import Constants from '../../common/Constants';
import MeasureParameters from '../MeasureParameters';
import DeviceData from '../../common/DeviceData';
import MainEventManager from '../../common/MainEventManager';
import GlobalStorage from '../../common/GlobalStorage';
import ChartBuilder from '../ChartBuilder';
import Chart from './Chart';

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();

class RtChartsPage extends React.Component {
    constructor(props) {
        super(props);
        this.measureParameters = new MeasureParameters();
        this.chartBuilder = new ChartBuilder();
        this.state = {
            count: 0,
            selectedMeasureParameterId:  this.measureParameters.get('inductorTemperature1').id,
        };
        this.rtDeviceData = null;
        this.chartData = {};
        for (let i = 0; i < this.measureParameters.size(); i++) {
            let parameter = this.measureParameters.byIndex(i);
            this.chartData[parameter.name] = [];
        }
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
        this.onChartSelect = this.onChartSelect.bind(this);
        this.onRtDeviceDataReady = this.onRtDeviceDataReady.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.timerId = null;
    }


    componentDidMount() {
        mainEventManager.subscribe('rt-device-data-ready', this.onRtDeviceDataReady);
        this.timerId = setTimeout(this.onTimer, 1000);
    }


    componentWillUnmount() {
        mainEventManager.unsubscribe('rt-device-data-ready', this.onRtDeviceDataReady);
        clearTimeout(this.timerId);
    }


    onRtDeviceDataReady() {
        this.appendChartData(globalStorage['deviceData']);
    }


    onTimer() {
        this.removeChartData(new Date());

        if ( this.props.visible ) {
            this.setState((oldState) => {
                let newState = Object.assign({}, oldState);
                newState.count++;
                return newState;
            });
        }

        this.timerId = setTimeout(this.onTimer, 1000);
    }


    appendChartData(newItem) {
        let date = newItem.date;
        let n = this.measureParameters.size();
        for (let i = 0; i < n; i++) {
            let parameterName = this.measureParameters.byIndex(i).name;
            this.chartData[parameterName].push(
              [date, newItem[parameterName]]
            );
        }
    }


    removeChartData(toDate) {
        let fromDateInt = toDate.getTime() - 1000*(Constants.rtChartPeriod + 3*60);
        for (let parameterName in this.chartData) {
            this.chartData[parameterName] = this.chartData[parameterName].filter(
              item => item[0].getTime() > fromDateInt
            );
        }
    }


    buildSeries(id) {
        let series = [];
        let measureParameter = this.measureParameters.byId(id);
        let data = this.chartData[measureParameter.name];
        let newSerie = this.chartBuilder.buildSerie({
            data: data
        });
        series.push(newSerie);
        return series;
    }


    onChartNumberButtonClick(index) {
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = this.measureParameters.byIndex(index).id;
            return newState;
        });
    }


    onChartSelect(event, id) {
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = id;
            return newState;
        });
    }


    render() {
        if ( !this.props.visible ) {
            return <div class='rt-charts-page back-page hidden' />
        }

        let parameterId = this.state.selectedMeasureParameterId;
        let chartOptions = this.chartBuilder.buildOptions({
            measureParameterId: parameterId,
            realTime: true
        });
        chartOptions.series = this.buildSeries(parameterId);

        return  <div class='rt-charts-page front-page'>
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
