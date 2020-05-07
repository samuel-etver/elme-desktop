import React from 'react';
import './RtValuesPage.css';
import ValuePane from './ValuePane.jsx';
import MeasureParameters from '../MeasureParameters.js';

class RtValuesPane extends React.Component {
    constructor(props) {
      super(props);
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
                <ValuePane caption   = {{text: inductor1TemperatureParam.caption}}
                             value   = {{text: 'bbb'}}
                             units   = {{text: inductor1TemperatureParam.units}} />
                <ValuePane caption   = {{text: inductor2TemperatureParam.caption}}
                             value   = {{text: 'bbb'}}
                             units   = {{text: inductor2TemperatureParam.units}} />
                <ValuePane caption   = {{text: thermostatTemperature1Param.caption}}
                             value   = {{text: 'bbb'}}
                             units   = {{text: thermostatTemperature1Param.units}} />
                <ValuePane caption   = {{text: thermostatTemperature2Param.caption}}
                             value   = {{text: 'bbb'}}
                             units   = {{text: thermostatTemperature2Param.units}} />
                <ValuePane caption   = {{text: sprayerTemperatureParam.caption}}
                             value   = {{text: 'bbb'}}
                            units    = {{text: sprayerTemperatureParam.units}} />
                <ValuePane caption   = {{text: heatingTemperatureParam.caption}}
                             value   = {{text: 'bbb'}}
                            units    = {{text: heatingTemperatureParam.units}} />
                <ValuePane caption   = {{text: waterflowParam.caption}}
                             value   = {{text: 'bbb'}}
                            units    = {{text: waterflowParam.units}} />
            </div>
        );
    }
}

function RtValuesPage() {
    return <div class="RtValuesPage">
    <RtValuesPane />

    </div>
}

export default RtValuesPage;
