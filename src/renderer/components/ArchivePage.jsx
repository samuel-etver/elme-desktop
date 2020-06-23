import React from 'react';
import './ArchivePage.css';
import Constants from '../../common/Constants';
import MeasureParameters from '../MeasureParameters';
import EventManager from '../../common/EventManager';
import MainEventManager from '../../common/MainEventManager';
import MeasureParametersComboBox from './MeasureParametersComboBox';
import NumberButtonsGroup from './NumberButtonsGroup';
import HorzDivider from './HorzDivider';
import ChartBuilder from '../ChartBuilder';
import Chart from './Chart';
import DateInputPane from './DateInputPane';

let mainEventManager = MainEventManager.getInstance();

class ArchivePage extends React.Component {
    constructor(props) {
        super(props);
        this.prefix = 'archive-page-';
        this.measureParameters = new MeasureParameters();
        this.eventManager = new EventManager();
        this.chartBuilder = new ChartBuilder();
        let measureParameter = this.measureParameters.get('inductorTemperature1');
        this.state = {
            selectedMeasureParameterId: measureParameter.id,
        };
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
        this.onChartSelect = this.onChartSelect.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }


    componentDidMount() {
        this.eventManager.subscribe(this.prefix + 'number-button-click', this.onChartNumberButtonClick);
        this.eventManager.subscribe(this.prefix + 'combobox-select', this.onChartSelect);
        this.eventManager.subscribe(this.prefix + 'update', this.onUpdate);
    }


    componentWillUnmount() {
        this.eventManager.unsubscribe(this.prefix + 'number-button-click', this.onChartNumberButtonClick);
        this.eventManager.unsubscribe(this.prefix + 'combobox-select', this.onChartSelect);
        this.eventManager.unsubsсribe(this.prefix + 'update', this.onUpdate);
    }


    onUpdate(event, options) {
        if (this.props.visible) {
            let id = (!options || !options.id)
              ? this.state.selectedMeasureParameterId
              : options.id;

            this.setState({
                selectedMeasureParameterId: id,
            });
        }
    }


    onChartNumberButtonClick(event, index) {
        let parameter = this.measureParameters.byIndex(index);
        this.eventManager.publish(this.prefix + 'update', {
            id: parameter.id
        });
    }


    onChartSelect(event, id) {
        this.eventManager.publish(this.prefix + 'update', {
            id: id
        });
    }


    render() {
        let style = 'archive-page ';
        if ( this.props.visible ) {
            style += 'front-page';
        }
        else {
            style += 'back-page hidden';
        }

        if ( !this.props.visible ) {
            return <div class={style} />;
        }

        let dateInputPaneOptions = {
            prefix: this.prefix,
            year: '',
            month: '',
            day: '',
            hour: ''
        };
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
        let chartOptions = this.chartBuilder.buildOptions({
            measureParameterId: this.state.selectedMeasureParameterId
        });

        return  <div class={style}>
                    <DateInputPane options={dateInputPaneOptions}/>
                    <HorzDivider height="16px" />
                    <MeasureParametersComboBox options={chartCaptionOptions} />
                    <HorzDivider height="40px" />
                    <div class="archive-page-chart-pane">
                        <Chart options={chartOptions}/>
                    </div>
                    <HorzDivider height="20px" />
                    <NumberButtonsGroup options={chartNumberButtonsGroupOptions} />
                </div>;
    }
}

export default ArchivePage;
