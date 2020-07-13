import React from 'react';
import './ArchivePage.css';
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

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();
let archive = Archive.getInstance();
let xScaleParameters = new XScaleParameters();


class ArchivePage extends React.Component {
    constructor(props) {
        super(props);
        this.wasSelected = false;
        this.measureParameters = new MeasureParameters();
        this.chartBuilder = new ChartBuilder();
        this.xScrollBarOptions = this.chartBuilder.buildXScrollBarOptions();
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
            xScrollBarPosition: 50,
            xMax: undefined
        };
        this.onPageSelected = this.onPageSelected.bind(this);
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
        this.onChartSelect = this.onChartSelect.bind(this);
        this.onDateInput = this.onDateInput.bind(this);
        this.onXScaleChange = this.onXScaleChange.bind(this);
        this.onXScrollBarEvent = this.onXScrollBarEvent.bind(this);
    }


    componentDidMount() {
        mainEventManager.subscribe('page-selected', this.onPageSelected);
    }


    componentWillUnmount() {
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
            this.setState((oldState) => {
                let newState = Object.assign({}, oldState);
                newState.dateInputPaneData = dateInputPaneData;
                newState.xMax = date;
                return newState;
            });
        }
    }


    update(id) {
        if ( this.props.visible ) {
            this.setState((oldState) => {
                let newState = Object.assign({}, oldState);
                if ( id !== undefined ) {
                    newState.selectedMeasureParameterId = id;
                }
                return newState;
            });
        }
    }


    onChartNumberButtonClick(index) {
        this.update(this.measureParameters.byIndex(index).id);
    }


    onChartSelect(event, id) {
        this.update(id);
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


    onXScrollBarEvent(event, value) {
        let newValue;
        let options = this.xScrollBarOptions;
        let step;

        switch(event) {
            case 'value':
                newValue = value;
                break;
            case 'double-left':
                step = -options.doubleStep;
            case 'left':
                step = step ?? -options.step;
            case 'right':
                step = step ?? options.step;
            case 'double-right':
                step = step ?? options.doubleStep;
                newValue = this.state.xScrollBarPosition + step;
                if ( newValue < options.valueMin ) {
                    newValue += 50 - options.valueMin;
                }
                else if ( newValue > options.valueMax ) {
                    newValue -= options.valueMax - 50;
                }

            default: ;
        }

        let newValueSaved = newValue;


        if ( newValue !== undefined ) {
            this.setState((oldState) => {
                let newState = Object.assign({}, oldState);
                newState.xScrollBarPosition = newValue;
                newState.xMax = new Date(oldState.xMax.getTime() + (newValueSaved - oldState.xScrollBarPosition)*0.01*options.interval);
                return newState;
            });
        }
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
            year: this.state.dateInputPaneData.year,
            month: this.state.dateInputPaneData.month,
            day: this.state.dateInputPaneData.day,
            hour: this.state.dateInputPaneData.hour,
            callback: this.onDateInput
        };
        let chartOptions = this.chartBuilder.buildOptions({
            measureParameterId: this.state.selectedMeasureParameterId,
            xScaleParameter: xScaleParameters.get(this.state.xScale),
            xMax: this.state.xMax
        });

        return  <div class={style}>
                    <DateInputPane options={dateInputPaneOptions}/>
                    <HorzDivider height="16px" />
                    <MeasureParametersComboBox
                      selectedId={this.state.selectedMeasureParameterId}
                      callback={this.onChartSelect} />
                    <HorzDivider height="40px" />
                    <div class="archive-page-chart-pane">
                        <Chart options={chartOptions} >
                        </Chart>
                        <ChartScaleButtonsGroup
                          buttonIndex={this.state.xScale}
                          callback={this.onXScaleChange}/>
                    </div>
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


export default ArchivePage;
