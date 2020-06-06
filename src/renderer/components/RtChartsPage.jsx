import React from 'react';
import './RtChartsPage.css';
import './MeasureParametersComboBox';
import MeasureParametersComboBox from './MeasureParametersComboBox';
import NumberButtonsGroup from './NumberButtonsGroup';
import HorzDivider from './HorzDivider';
import MeasureParameters from '../MeasureParameters';
import EventManager from '../../common/EventManager';
import MainEventManager from '../../common/MainEventManager';
import ChartBuilder from '../ChartBuilder'

let mainEventManager = MainEventManager.getInstance();

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
            options: chartBuildOptions.options,
            series: chartBuildOptions.series
        };
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
    }


    componentDidMount() {
        this.eventManager.subscribe(this.prefix + 'number-button-click', this.onChartNumberButtonClick);
    }


    componentWillUnmount() {
        this.eventManager.unsubscribe(this.prefix + 'number-button-click', this.onChartNumberButtonClick);
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
/*        <ApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height="100%"
          width="100%"
        />*/

        return  <div class={style}>
                      <MeasureParametersComboBox options={chartCaptionOptions}/>
                      <HorzDivider height="40px" />
                      <div class="rt-charts-page-chart-pane">
                      </div>
                      <HorzDivider height="20px" />
                      <NumberButtonsGroup options={chartNumberButtonsGroupOptions}/>
                </div>
    }


    onChartNumberButtonClick(event, index) {
        let parameter = this.measureParameters.byIndex(index);
        this.setState({
            selectedMeasureParameterId: parameter.id
        });
    }
}

export default RtChartsPage;
