import React from 'react';
import './RtValuesPage.css';
import ValuePane from './ValuePane.jsx';
import MeasureParameters from '../MeasureParameters.js';
import GlobalStorage from '../../common/GlobalStorage';

const globalStorage = GlobalStorage.getInstance();
const measureParams = new MeasureParameters();

class RtValuesPane extends React.Component {
    constructor (props) {
        super(props);
        this.paramsProperties = this.createParamsProperties();
        this.state = this.createNewState();
    }


    createParamsProperties () {
        let properties = [];

        let temperatureToStr = function (t) {
            let value = parseFloat(t);
            return isNaN(value) ? '' : value.toFixed(1);
        };

        let waterFlowToStr = function (flow) {
            let value = parseFloat(flow);
            return isNaN(value) ? '' : value.toFixed(1);
        };

        let append = function(parameterName, toString) {
            properties.push({
                name:     parameterName,
                toString: toString
            });
        };


        append('inductorTemperature1', temperatureToStr);
        append('inductorTemperature2', temperatureToStr);
        append('thermostatTemperature1', temperatureToStr);
        append('thermostatTemperature2', temperatureToStr);
        append('sprayerTemperature', temperatureToStr);
        append('heatingTemperature', temperatureToStr);
        append('waterFlow', waterFlowToStr);

        return properties;
    }


    createNewState () {
        let newState = {};

        let deviceData = globalStorage['deviceData'];
        if (deviceData) {
            for (let property of this.paramsProperties) {
                let name = property.name;
                newState[name] = property.toString(deviceData[name]);
            }
        };

        return newState;
    }


    renderParam (paramName) {
        let param = measureParams.get(paramName);
        return <ValuePane caption = {param.caption}
                          value   = {this.state[paramName]}
                          units   = {param.units} />;
    }


    render () {
        let valuePanes = [];
        for (let property of this.paramsProperties) {
            valuePanes.push(this.renderParam(property.name));
        }

        return (
            <div class="rt-values-pane">
                {valuePanes}
            </div>
        );
    }


    componentDidMount () {
        this.timerId = setInterval(this.onTimer.bind(this), 1000);
    }


    componentWillUnmount () {
        clearInterval(this.timerId);
    }


    onTimer () {
        let newState = this.createNewState();
        this.setState(newState);
    }
}


function RtValuesPage (props) {
    if (!props.visible) {
        return  <div class='rt-values-page back-page hidden' />
    }
    return  <div class='rt-values-page front-page'>
                <RtValuesPane />
            </div>
}


export default RtValuesPage;
