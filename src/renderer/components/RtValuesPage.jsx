import React from 'react';
import './RtValuesPage.css';
import ValuePane from './ValuePane.jsx';
import MeasureParameters from '../MeasureParameters.js';
import MainEventManager from '../../common/MainEventManager';
import GlobalStorage from '../../common/GlobalStorage';

const mainEventManager = MainEventManager.getInstance();
const globalStorage = GlobalStorage.getInstance();

class RtValuesPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inductorTemperature1: null,
            inductorTemperature2: null,
            thermostatTemperature1: null,
            thermostatTemperature2: null,
            sprayerTemperature: null,
            heatingTemperature: null,
            waterFlow: null
        };
        this.onDeviceDataReady = this.onDeviceDataReady.bind(this);
    }


    render() {
        var measureParams = new MeasureParameters();
        var inductorTemperature1Param = measureParams.get('inductorTemperature1');
        var inductorTemperature2Param = measureParams.get('inductorTemperature2');
        var thermostatTemperature1Param = measureParams.get('thermostatTemperature1');
        var thermostatTemperature2Param = measureParams.get('thermostatTemperature2');
        var sprayerTemperatureParam = measureParams.get('sprayerTemperature');
        var heatingTemperatureParam = measureParams.get('heatingTemperature');
        var waterFlowParam = measureParams.get('waterFlow');
        return (
            <div class="rt-values-pane">
                <ValuePane caption = {inductorTemperature1Param.caption}
                             value = {this.temperatureToStr(this.state.inductorTemperature1)}
                             units = {inductorTemperature1Param.units} />
                <ValuePane caption = {inductorTemperature2Param.caption}
                             value = {this.temperatureToStr(this.state.inductorTemperature2)}
                             units = {inductorTemperature2Param.units} />
                <ValuePane caption = {thermostatTemperature1Param.caption}
                             value = {this.temperatureToStr(this.state.thermostatTemperature1)}
                             units = {thermostatTemperature1Param.units} />
                <ValuePane caption = {thermostatTemperature2Param.caption}
                             value = {this.temperatureToStr(this.state.thermostatTemperature2)}
                             units = {thermostatTemperature2Param.units} />
                <ValuePane caption = {sprayerTemperatureParam.caption}
                             value = {this.temperatureToStr(this.state.sprayerTemperature)}
                            units  = {sprayerTemperatureParam.units} />
                <ValuePane caption = {heatingTemperatureParam.caption}
                             value = {this.temperatureToStr(this.state.heatingTemperature)}
                             units = {heatingTemperatureParam.units} />
                <ValuePane caption = {waterFlowParam.caption}
                             value = {this.waterFlowToStr(this.state.waterFlow)}
                             units = {waterFlowParam.units} />
            </div>
        );
    }


    componentDidMount() {
        mainEventManager.subscribe('rt-device-data-ready', this.onDeviceDataReady);
    }


    componentWillUnmount() {
        mainEventManager.unsubscribe('rt-device-data-ready', this.onDeviceDataReady);
    }


    temperatureToStr(t) {
        let value = parseFloat(t);
        return isNaN(value) ? '' : value.toFixed(1);
    }


    waterFlowToStr(flow) {
        let value = parseFloat(flow);
        return isNaN(value) ? '' : value.toFixed(1);
    }


    onDeviceDataReady() {
        let deviceData = globalStorage['deviceData'];
        this.setState({
            inductorTemperature1: deviceData.inductorTemperature1,
            inductorTemperature2: deviceData.inductorTemperature2,
            thermostatTemperature1: deviceData.thermostatTemperature1,
            thermostatTemperature2: deviceData.thermostatTemperature2,
            sprayerTemperature: deviceData.sprayerTemperature,
            heatingTemperature: deviceData.heatingTemperature,
            waterFlow: deviceData.waterFlow
        });
    }
}

class RtValuesPage extends React.Component {
    render() {
        let style = 'rt-values-page ';
        if ( this.props.style ) {
            style += this.props.style;
        }
        return  <div class={style}>
                    <RtValuesPane />
                </div>
    }
}

export default RtValuesPage;
