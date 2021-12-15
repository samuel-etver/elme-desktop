import MeasureParameters from './MeasureParameters';
import Constants from '../common/Constants';
import XScaleParameters from './components/XScaleParameters';
import Calendar from '../common/Calendar';

let measureParameters = new MeasureParameters();
let xScaleParameters = new XScaleParameters();


let xFormatter = function (x) {
    return Calendar.timeToStr(x);
};

let yFormatter = function (y) {
    return y.toFixed(1);
};

let tooltip = {
    trigger: 'axis',
    axisPointer: {
        type: 'cross',
        animation: false,
        label: {
            backgroundColor: 'green',
            formatter: function(params) {
                if ( params.axisDimension === 'y' ) {
                    return yFormatter(params.value);
                }
                let dt = new Date(params.value);
                let minute = dt.getMinutes();
                let second = dt.getSeconds();
                let txt = dt.getHours() + ':'
                  + (minute < 10 ? '0' : '') + minute.toString() + ':'
                  + (second < 10 ? '0' : '') + second.toString();
                return txt;
            }
        },
    },
    backgroundColor: '#c0c9',
    textStyle: {
        color: '#fff'
    },
    formatter: function (params) {
        params = params[0];
        return '<div style="text-align:left"><span style="color:#aaff">x=</span>' + xFormatter(params.value[0]) + '<br>' +
               '<span style="color:#aaff">y=</span>' + yFormatter(params.value[1])+ '</div>';
    }
};

let splitLine = {
    show: true,
    lineStyle: {
        type: 'dotted',
        color: '#888'
    }
};


class ChartBuilder {
    buildOptions (inOptions) {
        let measureParameter = measureParameters.byId(inOptions.measureParameterId);
        let yMin;
        let yMax;
        switch (measureParameter.name) {
            case 'inductorTemperature1':
            case 'inductorTemperature2':
            case 'thermostatTemperature1':
            case 'thermostatTemperature2':
            case 'sprayerTemperature':
            case 'heatingTemperature':
                yMin = 300.0;
                yMax = 1200.0;
                break;
            case 'waterFlow':
                yMin = 0.0;
                yMax = 250.0;
                break;
            default:
                return;
        }

        let axisLabel = {
            fontSize: 19,
            fontWeight: 'bold',
            color: inOptions.realTime ? 'pink' : '#cc3',
            textShadowColor: 'black',
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
            textShadowBlur: 5,
        };
        let xAxisLabel = Object.assign({}, axisLabel);
        xAxisLabel.showMinLabel = false;
        xAxisLabel.showMaxLabel = false;
        xAxisLabel.formatter = function (value) {
            let dt = new Date(value);
            let minutes = dt.getMinutes();
            let result = dt.getHours() + ':' +
              (minutes < 10 ? '0' + minutes : minutes);
            if (!inOptions.realTime) {
                let month = dt.getMonth() + 1;
                result += '\n' +
                  dt.getDate() + '.' +
                  (month < 10 ? '0' + month : month) + '.' +
                  dt.getFullYear().toString().slice(2);
            }
            return result;
        };
        let yAxisLabel = Object.assign({}, axisLabel);
        yAxisLabel.showMinLabel = false;
        yAxisLabel.formatter = function(value) {
            return value.toString();
        }

        let xMin;
        let xMax;
        if (inOptions.realTime || !inOptions.xMax) {
            xMax = new Date();
        }
        else {
            xMax = inOptions.xMax;
        }
        if (!inOptions.xScaleParameter) {
            xMin = new Date(xMax.getTime() - 1000*Constants.rtChartPeriod);
        }
        else {
            xMin = new Date(xMax.getTime() - 1000*60*inOptions.xScaleParameter.value);
        }

        return {
            grid: {
                show: true,
                backgroundColor: 'black',
                left: 80,
                right: 48,
                top: 20,
                bottom: inOptions.realTime ? 40 : 70,
            },
            xAxis: [
                {
                    type: 'time',
                    scale: true,
                    max: xMax,
                    min: xMin,
                    splitNumber: 8,
                    axisLine: {
                        show: false
                    },
                    axisLabel: xAxisLabel,
                    splitLine: splitLine,
                    animation: false
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    max: yMax,
                    min: yMin,
                    axisLine: {
                        show: false
                    },
                    axisLabel: yAxisLabel,
                    splitLine: splitLine
                }
            ],
            tooltip: tooltip
        }
    }


    buildSerie (inOptions) {
        return {
            type: 'line',
            lineStyle: {
                width: 3,
                color: '#ffa',
            },
            data: inOptions.data,
            animation: false
        };
    }


    buildXScrollBarOptions (inOptions) {
        return {
            step: 1,
            doubleStep: 5,
            valueMin: 1,
            valueMax: 99,
            interval: 2*(xScaleParameters.get(inOptions.xScale).value*60*1000)
        };
    }
}


export default ChartBuilder;
