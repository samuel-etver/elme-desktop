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

        let axisLabelFontSize = '20px';


        return {
            options: {
                chart: {
                    id: "basic-chart",
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false
                    },
                    animation: {
                        enabled: false
                    },
                    paddings: '80px',
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: axisLabelFontSize,
                        },
  //                      formatter: function() { return 'HH:mm'}
},
                    min: 0,
                    max: 5
                },
                yaxis: {
                    axisBorder: {
                        show: true,
                        offsetX: -3,
                    },
                    labels: {
                        style: {
                            fontSize: axisLabelFontSize,
                            cssClass: 'chart-labels'
                        }
                    },
                    min: yMin,
                    max:  yMax
                },
                grid: {
                    show: true,
                    borderColor: 'transparent',
                    strokeDashArray: 7,
                    position: 'back',
                    xaxis: {
                        lines: {
                            show: true,
                        }
                    },
                    yaxis:  {
                        lines: {
                            show: true,
                        }
                    },
                    row: {
                  },
                    padding: {
                        top: 0,
                        bottom: -20,
                        left: 10,
                        right: 20
                    }
                }

            },
            series: [
                {
                    name: "series-1",
                    data: [[1, 30], [2, 31], [4, 33], [7, 45]]
                }
            ]
        };
    }
}


export default ChartBuilder;
