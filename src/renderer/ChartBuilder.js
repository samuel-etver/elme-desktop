import MeasureParameters from './MeasureParameters';

let measureParameters = new MeasureParameters();

class ChartBuilder {
    buildOptions(inOptions) {
        let measureParameter = inOptions.measureParameter;
        switch ( measureParameter.name ) {
            case 'inductorTemperature1':
            case 'inductorTemperature2':
            case 'thermostatTemperature1':
            case 'thermostatTemperature2':
            case 'sprayerTemperature':
            case 'heatingTemperature':
                var yMin = 0.0;
                var yMax = 100.0;
                break;
            case 'waterFlow':
                var yMin = 0.0;
                var yMax = 20.0;
                break;
        }

        let axisLabel = {
            fontSize: 19,
            fontWeight: 'bold',
            color: 'pink',
            textShadowColor: 'black',
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
            textShadowBlur: 5,
        };
        let xAxisLabel = Object.assign({}, axisLabel);
        xAxisLabel.formatter = function(value) {
            let dt = new Date(value);
            let hours = dt.getHours();
            let minutes = dt.getMinutes();
            let result = hours + ':';
            if ( minutes < 10 ) {
                result += '0';
            }
            return result += minutes;
        };
        let yAxisLabel = Object.assign({}, axisLabel);
        yAxisLabel.showMinLabel = false;
        let splitLine = {
            show: true,
            lineStyle: {
                type: 'dotted'
            }
        }

        let xMin;
        let xMax;
        //if ( inOptions.currTime ) {
            let now = Date.now();
            xMax = new Date(now);
            xMin = new Date(now - 1000*60*30);
        //}


        return {
            grid: {
                show: true,
                backgroundColor: 'black',
            },
            xAxis: [
                {
                    type: 'time',
                    scale: true,
                    max: xMax,
                    min: xMin,
                    axisLine: {
                        show: false
                    },
                    axisLabel: xAxisLabel,
                    splitLine: splitLine
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
        }
    }
}


export default ChartBuilder;
