const appName = 'elme';
const configFileName = appName + '.config';

module.exports = {
    debug: false,
    appName: appName,
    configFileName: configFileName,
    configVars: [
        'deviceIp',
        'devicePort',
    ],
    deviceReadInterval: 1000,
    deviceMock: true,
    rtChartPeriod: 30*60, // seconds
    rtChartRecordInterval: 30, // seconds
    months: [
        'январь',
        'февраль',
        'март',
        'апрель',
        'май',
        'июнь',
        'июль',
        'август',
        'сентябрь',
        'октябрь',
        'ноябрь',
        'декабрь'
    ],
};
