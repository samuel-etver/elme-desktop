import React from 'react';
import './ArchivePage.css';
import Constants from '../../common/Constants';
import MeasureParameters from '../MeasureParameters';
import EventManager from '../../common/EventManager';
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

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();
let archive = Archive.getInstance();
let xScaleParameters = new XScaleParameters();


class ArchivePage extends React.Component {
    constructor(props) {
        super(props);
        this.prefix = 'archive-page-';
        this.wasSelected = false;
        this.measureParameters = new MeasureParameters();
        this.eventManager = new EventManager();
        this.chartBuilder = new ChartBuilder();
        let measureParameter = this.measureParameters.get('inductorTemperature1');
        this.state = {
            selectedMeasureParameterId: measureParameter.id,
            dateInputPaneData: {
                year: '',
                month: '',
                day: '',
                hour: ''
            },
            xScale: 0,
            xMax: undefined
        };
        this.onPageSelected = this.onPageSelected.bind(this);
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
        this.onChartSelect = this.onChartSelect.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDateInput = this.onDateInput.bind(this);
        this.onXScaleChange = this.onXScaleChange.bind(this);
    }


    componentDidMount() {
        this.eventManager.subscribe(this.prefix + 'number-button-click', this.onChartNumberButtonClick);
        this.eventManager.subscribe(this.prefix + 'combobox-select', this.onChartSelect);
        this.eventManager.subscribe(this.prefix + 'update', this.onUpdate);
        mainEventManager.subscribe('page-selected', this.onPageSelected);
    }


    componentWillUnmount() {
        this.eventManager.unsubscribe(this.prefix + 'number-button-click', this.onChartNumberButtonClick);
        this.eventManager.unsubscribe(this.prefix + 'combobox-select', this.onChartSelect);
        this.eventManager.unsubsсribe(this.prefix + 'update', this.onUpdate);
        mainEventManager.unsubscribe('page-selected', this.onPageSelected);
    }


    onPageSelected() {
        if ( !this.wasSelected ) {
            this.wasSelected = true;

            let date = new Date();
            let dateInputPaneData = {
                hour: date.getHours().toString(),
                day: date.getDate().toString(),
                month: Constants.months.capitalize(date.getMonth()),
                year:  date.getFullYear().toString()
            };
            this.setState({
                dateInputPaneData: dateInputPaneData,
                xMax: date
            });;
        }
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


    onDateInput(event, data) {
        let dateInputPaneData;

        if ( event === 'change' || event === 'submit' ) {
            for (let item in data) {
                switch( item ) {
                    case 'hour':
                    case 'day':
                    case 'month':
                    case  'year':
                        if ( !dateInputPaneData ) {
                            dateInputPaneData = {};
                        }
                        dateInputPaneData[item] = data[item];
                }
            }
        }


        if ( dateInputPaneData ) {
            this.setState(state => {
                let newState = Object.assign({}, state);
                newState.dateInputPaneData = Object.assign(newState.dateInputPaneData, dateInputPaneData);
                if ( data.valid ) {
                    newState.xMax = new Date(
                        parseInt(newState.dateInputPaneData.year),
                        Constants.months.find(newState.dateInputPaneData.month),
                        parseInt(newState.dateInputPaneData.day),
                        parseInt(newState.dateInputPaneData.hour)
                    );
                }
                return newState;
            });
        }
    }


    onXScaleChange(buttonIndex) {
        this.setState(state => {
            let newState = Object.assign({}, state);
            newState.xScale = buttonIndex;
            return newState;
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
            year: this.state.dateInputPaneData.year,
            month: this.state.dateInputPaneData.month,
            day: this.state.dateInputPaneData.day,
            hour: this.state.dateInputPaneData.hour,
            callback: this.onDateInput
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
            measureParameterId: this.state.selectedMeasureParameterId,
            xScaleParameter: xScaleParameters.get(this.state.xScale),
            xMax: this.state.xMax
        });

        return  <div class={style}>
                    <DateInputPane options={dateInputPaneOptions}/>
                    <HorzDivider height="16px" />
                    <MeasureParametersComboBox options={chartCaptionOptions} />
                    <HorzDivider height="40px" />
                    <div class="archive-page-chart-pane">
                        <Chart options={chartOptions} >
                        </Chart>
                        <ChartScaleButtonsGroup
                          buttonIndex={this.state.xScale}
                          callback={this.onXScaleChange}/>
                    </div>
                    <HorzDivider height="8px" />
                    <ChartHorzScrollBar />
                    <HorzDivider height="20px" />
                    <NumberButtonsGroup options={chartNumberButtonsGroupOptions} />
                </div>;
    }
}


export default ArchivePage;
