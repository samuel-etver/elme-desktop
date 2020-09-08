import React from 'react';
import './MarkupPage.css'
import ArchivePageMixin from './ArchivePageMixin';
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
import ReactTable from 'react-table';

let mainEventManager = MainEventManager.getInstance();
let globalStorage = GlobalStorage.getInstance();
let archive = Archive.getInstance();
let xScaleParameters = new XScaleParameters();

class MarkupPage extends React.Component {
    constructor(props) {
        super(props)
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
        this.archiveMessageManager = {
            timerId: undefined,
            publish: function(...args) {
                clearTimeout(this.timerId);
                this.timerId = setTimeout(() => {
                    mainEventManager.publish('archive-data-read', ...args);
                }, 500);
            }
        };
        this.series = null;
        this.seriesParameterId = -1;
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

            let xScale = this.state.xScale;
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
                this.archiveMessageManager.publish( {
                    dateFrom: new Date(newState.xMax.getTime() - xScaleParameters.get(xScale).value*60*1000),
                    dateTo: newState.xMax
                });
                return newState;
            });
        }
    }


    onChartNumberButtonClick(index) {
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = this.measureParameters.byIndex(index).id;
            return newState;
        });
    }


    onChartSelect(event, id) {
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = id;
            return newState;
        });
    }


    onDateInput(event, data) {
        let dateInputPaneData;

        if ( event === 'change' || event === 'submit' ) {
            for (let item in data) {
                switch( item ) {
                    case 'hour':
                    case 'minute':
                    case 'second':
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
            this.setState((oldState) => {
                let newState = Object.assign({}, oldState);
                newState.dateInputPaneData = Object.assign(newState.dateInputPaneData, dateInputPaneData);
                if ( data.valid ) {
                    let minute = dateInputPaneData.minute ?? 0;
                    let second = dateInputPaneData.second ?? 0;
                    newState.xMax = new Date(
                        parseInt(newState.dateInputPaneData.year),
                        Constants.months.find(newState.dateInputPaneData.month),
                        parseInt(newState.dateInputPaneData.day),
                        parseInt(newState.dateInputPaneData.hour),
                        parseInt(minute),
                        parseInt(second)
                    );
                    this.archiveMessageManager.publish( {
                        dateFrom: new Date(newState.xMax.getTime() - xScaleParameters.get(this.state.xScale).value*60*1000),
                        dateTo: newState.xMax
                    });
                }
                return newState;
            });
        }
    }


    onXScaleChange(buttonIndex) {
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.xScale = buttonIndex;
            this.archiveMessageManager.publish( {
                dateFrom: new Date(oldState.xMax.getTime() - xScaleParameters.get(newState.xScale).value*60*1000),
                dateTo: oldState.xMax
            });
            return newState;
        });
    }


    onXScrollBarEvent(event, value) {
        let newValue;
        let xScale = this.state.xScale;
        let options = this.chartBuilder.buildXScrollBarOptions({
              xScale: xScale
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
                this.archiveMessageManager.publish( {
                    dateFrom: new Date(xMax.getTime() - xScaleParameters.get(xScale).value*60*1000),
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
            let xs  = measures['date'];
            let ys  = measures[measureParameter.name];
            data = this.packData(Array.from(xs, (x, i) => [x, ys[i]]));
        }
        let newSerie = this.chartBuilder.buildSerie({
            data: data
        });
        series.push(newSerie);
        return series;
    }


    packData(data) {
        if ( !data || data.length < 1000) {
            return data;
        }

        let interval;
        switch(this.state.xScale) {
            case 2:
                interval = 5;
                break;
            case 3:
                interval = 15;
                break;
            case 4:
                interval = 30;
                break;
            case 5:
                 interval = 60;
                 break;
            case 6:
                  interval = 120;
                  break;
            default:
                return data;
        }
        interval *= 1000;


        let result = [];

        let dt0 = new Date(data[0][0].getTime());
        dt0.setMilliseconds(0);
        dt0.setSeconds(0);
        dt0.setMinutes(2*(dt0.getMinutes() >> 1));
        let dt0Int = dt0.getTime();

        let dt1 = data[data.length - 1][0];
        let dt1Int = dt1.getTime();


        let index = 0;
        let singles = 0;

        while (dt0Int <= dt1Int) {
            let dtNextInt = dt0Int + interval;

            let minY;
            let maxY;
            let minIndex;
            let maxIndex
            let dotCount = 0;

            for(; index < data.length; index++) {
                let [x, y] = data[index];
                if ( x.getTime() >= dtNextInt ) {
                    break;
                }
                dotCount++;
                if ( y !== undefined ) {
                    if ( minY === undefined) {
                        minY = y;
                        maxY = y;
                    }
                    else {
                        if ( minY > y ) {
                            minY = y;
                            minIndex = index;
                        }
                        if ( maxY < y ) {
                            maxY = y;
                            maxIndex = index;
                        }
                    }
                }
            }

            if ( dotCount ) {
                if ( minIndex === undefined ) {
                    result.push(data[index - 1]);
                }
                else {
                    if ( dotCount === 1 || minIndex === maxIndex) {
                        result.push( data[minIndex] );
                        singles++;
                    }
                    else {
                        if ( minIndex < maxIndex ) {
                            result.push( data[minIndex], data[maxIndex] );
                        }
                        else {
                            result.push( data[maxIndex], data[minIndex] );
                        }
                    }
                }
            }

            dt0Int = dtNextInt;
        }

        return result;
    }


    onArchiveDataReady(event, arg) {
        this.archiveData = arg;
        this.seriesParameterId = -1;
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.dataPacketCount++;
            return newState;
        });
    }


    render() {
        let style = 'markup-page ';
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
        if ( this.seriesParameterId === this.state.selectedMeasureParameterId) {
            chartOptions.series = this.series;
        }
        else {
            this.seriesParameterId = this.state.selectedMeasureParameterId
            this.series = this.buildSeries(this.seriesParameterId);
            chartOptions.series = this.series;
        }

        return  <div class='markup-page'>
                    <DateInputPane options={dateInputPaneOptions}/>
                    <HorzDivider height="16px" />
                    <MeasureParametersComboBox
                      selectedId={this.state.selectedMeasureParameterId}
                      callback={this.onChartSelect} />
                    <HorzDivider height="40px" />
                    <div class="markup-page-data-pane">
                      <div class="markup-page-chart-root-pane">
                        <div class="markup-page-chart-pane">
                            <Chart options={chartOptions} >
                            </Chart>
                            <ChartScaleButtonsGroup
                              buttonIndex={this.state.xScale}
                              callback={this.onXScaleChange}/>
                        </div>
                      </div>
                      <div class="markup-page-table-pane">
                      </div>
                      <div>
                        <HorzDivider height="8px" />
                        <ChartHorzScrollBar
                          value={this.state.xScrollBarPosition}
                          callback={this.onXScrollBarEvent}
                        />
                      </div>
                    </div>
                    <NumberButtonsGroup
                      count={this.measureParameters.size()}
                      callback={this.onChartNumberButtonClick} />
                </div>;
    }
}


export default MarkupPage;
