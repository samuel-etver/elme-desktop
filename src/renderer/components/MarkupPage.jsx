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
        super(props);
        this.initImpl();
    }


    componentDidMount() {
        this.componentDidMountImpl();
    }


    componentWillUnmount() {
        this.componentWillUnmountImpl();
    }


    onPageSelected(event, pageName) {
        if (pageName !== 'markup') {
            return;
        }

        if (!this.wasSelected) {
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
                mainEventManager.publish('to-console', 'arhive msg 10');
                this.archiveMessageManager.publish( {
                    dateFrom: new Date(newState.xMax.getTime() - xScaleParameters.get(xScale).value*60*1000),
                    dateTo: newState.xMax
                });
                return newState;
            });
        }
    }


    onChartNumberButtonClick(index) {
        this.onChartNumberButtonClickImpl(index);
    }


    onChartSelect(event, id) {
        this.onChartSelectImpl(event, id);
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


    onXScrollBarEvent(event, value) {
        this.onXScrollBarEventImpl(event, value);
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
            return <div class={style} />;
        }

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
                    <DateInputPane
                      year={this.state.dateInputPaneData.year}
                      month={this.state.dateInputPaneData.month}
                      day={this.state.dateInputPaneData.day}
                      hour={this.state.dateInputPaneData.hour}
                      callback={this.onDateInput} />
                    <HorzDivider height="16px" />
                    <MeasureParametersComboBox
                      selectedId={this.state.selectedMeasureParameterId}
                      callback={this.onChartSelect} />
                    <HorzDivider height="40px" />
                    <div class="markup-page-data-pane">
                      <div class="markup-page-chart-root-pane">
                        <div class="markup-page-chart-pane">
                            <Chart options={chartOptions} />
                            <ChartScaleButtonsGroup
                              buttonIndex={this.state.xScale}
                              callback={this.onXScaleChange} />
                        </div>
                      </div>
                      <div class="markup-page-table-pane">
                      </div>
                      <div>
                        <HorzDivider height="8px" />
                        <ChartHorzScrollBar
                          value={this.state.xScrollBarPosition}
                          callback={this.onXScrollBarEvent} />
                      </div>
                    </div>
                    <NumberButtonsGroup
                      count={this.measureParameters.size()}
                      callback={this.onChartNumberButtonClick} />
                </div>;
    }
}

(function() {
    Object.assign(MarkupPage.prototype, ArchivePageMixin);
})();


export default MarkupPage;
