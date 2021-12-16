import React from 'react';
import './RtValuesPage.css';
import ValuePane from './ValuePane.jsx';
import MeasureParameters from '../MeasureParameters.js';
import GlobalStorage from '../../common/GlobalStorage';

const globalStorage = GlobalStorage.getInstance();
const measureParameters = new MeasureParameters();

class RtValuesPane extends React.PureComponent {
    constructor (props) {
        super(props);
        this.parametersProperties = this.createParametersProperties();
        this.state = this.createNewState();
    }


    createParametersProperties () {
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
            for (let property of this.parametersProperties) {
                let name = property.name;
                newState[name] = property.toString(deviceData[name]);
            }
        };

        return newState;
    }


    renderParameter (parameterName) {
        let parameter = measureParameters.get(parameterName);
        return <ValuePane caption = {parameter.caption}
                          value   = {this.state[parameterName]}
                          units   = {parameter.units} />;
    }


    render () {
        let valuePanes = [];
        for (let property of this.parametersProperties) {
            valuePanes.push(this.renderParameter(property.name));
        }

        return <div class="rt-values-pane">
                  {valuePanes}
              </div>;
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
            </div>;
}


export default React.memo(RtValuesPage);
