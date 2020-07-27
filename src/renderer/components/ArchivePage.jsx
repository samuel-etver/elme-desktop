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
globalStorage.archive = {};
let archive = Archive.getInstance();
let xScaleParameters = new XScaleParameters();


class ArchivePage extends React.Component {
    constructor(props) {
        super(props);
        this.wasSelected = false;
        this.measureParameters = new MeasureParameters();
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
            xScale: 1,
            xScrollBarPosition: 50,
            xMax: undefined,
            dataPacketCount: 0
        };
        this.archiveData = undefined;
        this.onPageSelected = this.onPageSelected.bind(this);
        this.onChartNumberButtonClick = this.onChartNumberButtonClick.bind(this);
        this.onChartSelect = this.onChartSelect.bind(this);
        this.onDateInput = this.onDateInput.bind(this);
        this.onXScaleChange = this.onXScaleChange.bind(this);
        this.onXScrollBarEvent = this.onXScrollBarEvent.bind(this);
        this.onArchiveDataReady = this.onArchiveDataReady.bind(this);
    }


    componentDidMount() {
        mainEventManager.subscribe('page-selected', this.onPageSelected);
        mainEventManager.subscribe('archive-data-ready', this.onArchiveDataReady);
    }


    componentWillUnmount() {
        mainEventManager.unsubscribe('page-selected', this.onPageSelected);
        mainEventManager.unsubscribe('archive-data-ready', this.onArchiveDataReady);
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
        let options = this.chartBuilder.buildXScrollBarOptions({
              xScale: this.state.xScale
        });
        let step;
        let newValueSaved;

        var validatePosition = function() {
            if ( newValue < options.valueMin ) {
                newValue += 50 - options.valueMin;
            }
            else if ( newValue > options.valueMax ) {
                newValue -= options.valueMax - 50;
            }
        };

        switch(event) {
            case 'scroll':
                newValue = value;
                newValueSaved = newValue;
                break;
            case 'stop':
                newValue = value;
                newValueSaved = newValue;
                validatePosition();
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
                newValueSaved = newValue;
                validatePosition();

            default: ;
        }

        if ( newValue !== undefined ) {
            this.setState((oldState) => {
                let newState = Object.assign({}, oldState);
                newState.xScrollBarPosition = newValue;
                let xMax = new Date(oldState.xMax.getTime() + (newValueSaved - oldState.xScrollBarPosition)*0.01*options.interval);
                if ( xMax.getTime() < Constants.archiveDateMin.getTime() ) {
                    xMax = Constants.archiveDateMin;
                }
                newState.xMax = xMax;
                newState.dateInputPaneData.hour = xMax.getHours();
                newState.dateInputPaneData.day = xMax.getDate();
                newState.dateInputPaneData.month = Constants.months.capitalize(xMax.getMonth());
                newState.dateInputPaneData.year = xMax.getFullYear();
                mainEventManager.publish('archive-data-read', {
                    dateFrom: new Date(xMax.getTime() - 1000*60*10),
                    dateTo: xMax
                });
                return newState;
            });
        }
    }


    buildSeries(id) {
        let series = [];
        let data = [];
        let measureParameter = this.measureParameters.byId(id);
        if ( this.archiveData ) {
            let measures = this.archiveData.measures;
            for (let item of measures) {
                data.push( [item.date, item[measureParameter.name]] );
            }
        }
        let newSerie = this.chartBuilder.buildSerie({
            data: data
        });
        series.push(newSerie);
        return series;
    }


    onArchiveDataReady(event, arg) {
        this.archiveData = arg;
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.dataPacketCount++;
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
        chartOptions.series = this.buildSeries(this.state.selectedMeasureParameterId);

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
