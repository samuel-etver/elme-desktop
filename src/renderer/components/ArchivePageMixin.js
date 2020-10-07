import Constants from '../../common/Constants';
import XScaleParameters from './XScaleParameters';

let xScaleParameters = new XScaleParameters();

let ArchivePageMixin = {
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
    },


    onChartNumberButtonClickImpl(index) {
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = this.measureParameters.byIndex(index).id;
            return newState;
        });
    },


    onChartSelectImpl(event, id) {
        this.setState((oldState) => {
            let newState = Object.assign({}, oldState);
            newState.selectedMeasureParameterId = id;
            return newState;
        });
    },


    onXScrollBarEventImpl(event, value) {
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
    },
};

export default ArchivePageMixin;
