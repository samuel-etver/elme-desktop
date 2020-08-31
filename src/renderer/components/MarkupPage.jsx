import React from 'react';
import './MarkupPage.css'
import Constants from '../../common/Constants';
import MeasureParameters from '../MeasureParameters';
import MainEventManager from '../../common/MainEventManager';
import GlobalStorage from '../../common/GlobalStorage';
import Archive from '../Archive';
import MeasureParametersComboBox from './MeasureParametersComboBox';
import NumberButtonsGroup from './NumberButtonsGroup';
import HorzDivider from './HorzDivider';
import ChartBuilder from '../ChartBuilder';
import Chart from './Chart';
import DateInputPane from './DateInputPane';
import ChartScaleButtonsGroup from './ChartScaleButtonsGroup';
import XScaleParameters from './XScaleParameters';
import ChartHorzScrollBar from './ChartHorzScrollBar';

class MarkupPage extends React.Component {
    constructor(props) {
        super(props)
        this.measureParameters = new MeasureParameters();
        let measureParameter = this.measureParameters.get('inductorTemperature1');
        this.state = {
            selectedMeasureParameterId: measureParameter.id,
            dateInputPaneData: {
                year: '',
                month: '',
                day: '',
                hour: ''
            },
            xScale: 1,
            xScrollBarPosition: 50,
            xMax: undefined,
        };
    }


    render() {
        let dateInputPaneOptions = {
            year: this.state.dateInputPaneData.year,
            month: this.state.dateInputPaneData.month,
            day: this.state.dateInputPaneData.day,
            hour: this.state.dateInputPaneData.hour,
            callback: this.onDateInput
        };
        return  <div class="markup-page">
                  <DateInputPane options={dateInputPaneOptions}/>
                  <HorzDivider height="16px" />
                  <MeasureParametersComboBox
                    selectedId={this.state.selectedMeasureParameterId}
                    callback={this.onChartSelect} />
                  <HorzDivider height="40px" />
                  <HorzDivider height="8px" />
                  <ChartHorzScrollBar
                      value={this.state.xScrollBarPosition}
                      callback={this.onXScrollBarEvent}
                  />
                  <HorzDivider height="20px" />
                  <NumberButtonsGroup
                    count={this.measureParameters.size()}
                    callback={this.onChartNumberButtonClick} />
              </div>;
    }
}


export default MarkupPage;
