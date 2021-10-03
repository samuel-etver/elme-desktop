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
let measureParameters = new MeasureParameters();

class RtChartsPage extends React.Component {
    constructor (props) {
        super(props);
        this.chartBuilder = new ChartBuilder();
        this.oldUpdateId = 0;
        this.newUpdateId = this.oldUpdateId + 1;
        this.state = {
            selectedMeasureParameterId:  measureParameters.get('inductorTemperature1').id,
            newUpdateId: this.updateId
        };
        this.chartData = {};
        for (let i = 0; i < measureParameters.size(); i++) {
            let parameter = measureParameters.byIndex(i);
            this.chartData[parameter.name] = [];
        }
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
        this.onChartSelect = this.onChartSelect.bind(this);
        this.onRtDeviceDataReady = this.onRtDeviceDataReady.bind(this);
    }


    componentDidMount () {
        mainEventManager.subscribe('rt-device-data-ready', this.onRtDeviceDataReady);
        this.timerId = setInterval(this.onTimer.bind(this), 1000);
    }


    componentWillUnmount () {
        mainEventManager.unsubscribe('rt-device-data-ready', this.onRtDeviceDataReady);
        clearInterval(this.timerId);
    }


    onRtDeviceDataReady () {
        this.appendChartData(globalStorage['deviceData']);
    }


    onTimer () {
        this.removeChartData(new Date());

        if (this.props.visible) {
            let newUpdateId = ++this.newUpdateId;
            this.setState((oldState) => {
                let newState = Object.assign({}, oldState);
                newState.newUpdateId = newUpdateId;
                return newState;
            });
        }
    }


    appendChartData (newItem) {
        let date = newItem.date;
        let n = measureParameters.size();
        for (let i = 0; i < n; i++) {
            let parameterName = measureParameters.byIndex(i).name;
            this.chartData[parameterName].push(
              [date, newItem[parameterName]]
            );
        }
    }


    removeChartData (toDate) {
        let fromDateInt = toDate.getTime() - 1000*(Constants.rtChartPeriod + 3*60);
        for (let parameterName in this.chartData) {
            this.chartData[parameterName] = this.chartData[parameterName].filter(
              item => item[0].getTime() > fromDateInt
            );
        }
    }


    buildSeries (id) {
        let series = [];
        let measureParameter = measureParameters.byId(id);
        let data = this.chartData[measureParameter.name];
        let newSerie = this.chartBuilder.buildSerie({
            data: data
        });
        series.push(newSerie);
        return series;
    }


    onChartNumberButtonClick (index) {
        let id = measureParameters.byIndex(index).id;
        this.selectMeasureParameter(id);
    }


    onChartSelect (event, id) {
        this.selectMeasureParameter(id);
    }


    selectMeasureParameter (id) {
        let newUpdateId = ++this.newUpdateId;
        this.setState(oldState => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = id;
            newState.newUpdateId = newUpdateId;
            return newState;
        });
    }


    render () {
        if (!this.props.visible) {
            return <div class='rt-charts-page back-page hidden' />
        }

        let parameterId = this.state.selectedMeasureParameterId;

        if (this.state.newUpdateId != this.oldUpdateId) {
            this.oldUpdateId = this.state.newUpdateId;
            this.chartOptions = this.chartBuilder.buildOptions({
                measureParameterId: parameterId,
                realTime: true
            });
            this.chartOptions.series = this.buildSeries(parameterId);
        }
        let chartOptions = this.chartOptions;

        return  <div class='rt-charts-page front-page'>
                      <MeasureParametersComboBox
                        selectedId={parameterId}
                        callback={this.onChartSelect}/>
                      <HorzDivider height="40px" />
                      <div class="rt-charts-page-chart-pane">
                          <Chart options={chartOptions}/>
                      </div>
                      <HorzDivider height="20px" />
                      <NumberButtonsGroup
                        count={measureParameters.size()}
                        callback={this.onChartNumberButtonClick}/>
                </div>
    }
}

export default RtChartsPage;
