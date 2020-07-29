import React from 'react';
import './RtValuesPage.css';
import ValuePane from './ValuePane.jsx';
import MeasureParameters from '../MeasureParameters.js';
import GlobalStorage from '../../common/GlobalStorage';

const globalStorage = GlobalStorage.getInstance();

class RtValuesPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
        this.timerId = undefined;
        this.onTimer = this.onTimer.bind(this);
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

        let deviceData = globalStorage['deviceData'];
        if ( deviceData ) {
            var inductorTemperature1 = deviceData.inductorTemperature1;
            var inductorTemperature2 = deviceData.inductorTemperature2;
            var thermostatTemperature1 = deviceData.thermostatTemperature1;
            var thermostatTemperature2 = deviceData.thermostatTemperature2;
            var sprayerTemperature = deviceData.sprayerTemperature;
            var heatingTemperature = deviceData.heatingTemperature;
            var waterFlow =  deviceData.waterFlow;
        }

        return (
            <div class="rt-values-pane">
                <ValuePane caption = {inductorTemperature1Param.caption}
                             value = {this.temperatureToStr(inductorTemperature1)}
                             units = {inductorTemperature1Param.units} />
                <ValuePane caption = {inductorTemperature2Param.caption}
                             value = {this.temperatureToStr(inductorTemperature2)}
                             units = {inductorTemperature2Param.units} />
                <ValuePane caption = {thermostatTemperature1Param.caption}
                             value = {this.temperatureToStr(thermostatTemperature1)}
                             units = {thermostatTemperature1Param.units} />
                <ValuePane caption = {thermostatTemperature2Param.caption}
                             value = {this.temperatureToStr(thermostatTemperature2)}
                             units = {thermostatTemperature2Param.units} />
                <ValuePane caption = {sprayerTemperatureParam.caption}
                             value = {this.temperatureToStr(sprayerTemperature)}
                            units  = {sprayerTemperatureParam.units} />
                <ValuePane caption = {heatingTemperatureParam.caption}
                             value = {this.temperatureToStr(heatingTemperature)}
                             units = {heatingTemperatureParam.units} />
                <ValuePane caption = {waterFlowParam.caption}
                             value = {this.waterFlowToStr(waterFlow)}
                             units = {waterFlowParam.units} />
            </div>
        );
    }


    componentDidMount() {
        this.timerId = setTimeout(this.onTimer, 1000);
    }


    componentWillUnmount() {
        clearTimeout(this.timerId);
    }


    temperatureToStr(t) {
        let value = parseFloat(t);
        return isNaN(value) ? '' : value.toFixed(1);
    }


    waterFlowToStr(flow) {
        let value = parseFloat(flow);
        return isNaN(value) ? '' : value.toFixed(1);
    }


    onTimer() {
      this.setState((oldState) => {
          let newState = Object.assign({}, oldState);
          newState.count++;
          return newState;
      });
      this.timerId = setTimeout(this.onTimer, 1000);
    }
}

class RtValuesPage extends React.Component {
    render() {
        if ( !this.props.visible ) {
            return  <div class='rt-values-page back-page hidden' />
        }
        return  <div class='rt-values-page front-page'>
                    <RtValuesPane />
                </div>
    }
}

export default RtValuesPage;
