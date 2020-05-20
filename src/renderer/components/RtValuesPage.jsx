import React from 'react';
import './RtValuesPage.css';
import ValuePane from './ValuePane.jsx';
import MeasureParameters from '../MeasureParameters.js';
import MainEventManager from '../../common/MainEventManager';
import GlobalStorage from '../../common/GlobalStorage';

const mainEventManager = MainEventManager.getInstance();
const globalStorage = GlobalStorage.getInstance();

var i = 0;

class RtValuesPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inductor1Temperature: null,
            inductor2Temperature: null
        };
    }


    render() {
        var measureParams = new MeasureParameters();
        var inductor1TemperatureParam = measureParams.get('inductor1Temperature');
        var inductor2TemperatureParam = measureParams.get('inductor2Temperature');
        var thermostatTemperature1Param = measureParams.get('thermostatTemperature1');
        var thermostatTemperature2Param = measureParams.get('thermostatTemperature2');
        var sprayerTemperatureParam = measureParams.get('sprayerTemperature');
        var heatingTemperatureParam = measureParams.get('heatingTemperature');
        var waterflowParam = measureParams.get('waterflow');
        return (
            <div class="RtValuesPane">
                <ValuePane caption = {inductor1TemperatureParam.caption}
                             value = {this.temperatureToStr(this.state.inductor1Temperature)}
                             units = {inductor1TemperatureParam.units} />
                <ValuePane caption = {inductor2TemperatureParam.caption}
                             value = {'bbb'}
                             units = {inductor2TemperatureParam.units} />
                <ValuePane caption = {thermostatTemperature1Param.caption}
                             value = {'bbb'}
                             units = {thermostatTemperature1Param.units} />
                <ValuePane caption = {thermostatTemperature2Param.caption}
                             value = {'bbb'}
                             units = {thermostatTemperature2Param.units} />
                <ValuePane caption = {sprayerTemperatureParam.caption}
                             value = {'bbb'}
                            units  = {sprayerTemperatureParam.units} />
                <ValuePane caption = {heatingTemperatureParam.caption}
                             value = {'bbb'}
                             units = {heatingTemperatureParam.units} />
                <ValuePane caption = {waterflowParam.caption}
                             value = {'bbb'}
                             units = {waterflowParam.units} />
            </div>
        );
    }


    componentDidMount() {
        mainEventManager.subscribe('rt-device-data-ready', () => this.onDeviceDataReady());
    }


    componentWillUnmount() {

    }


    temperatureToStr(t) {
        let value = parseFloat(t);
        return isNaN(value) ? '' : value.toFixed(1);
    }


    onDeviceDataReady() {
        let deviceData = globalStorage['deviceData'];
        i++;
        this.setState({
            inductor1Temperature: deviceData.inductorTemperature1 + i,
        });
    }
}

function RtValuesPage() {
    return <div class="RtValuesPage">
    <RtValuesPane />

    </div>
}

export default RtValuesPage;
