const appName = 'elme';
const configFileName = appName + '.config';

let months = [
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
];


months.capitalize = function (index) {
    let str = months[index];
    return str.charAt(0).toUpperCase() + str.slice(1);
}


months.find = function (str) {
    if ( !str ) {
        return -1;
    }

    str = str.toLowerCase();
    return months.findIndex(element => element === str);
}


months.has = function (str) {
    return months.find(str) >= 0;
}


months.findByPartialMatch = function (str) {
    if (!str) {
        return -1;
    }
    str = str.trim().toLowerCase();
    let strLen = str.length;
    if (!strLen) {
        return -1;
    }

    for (let i = 0; i < months.length; i++) {
        if ( months[i].slice(0, strLen) === str ) {
            return i;
        }
    }

    return -1;
}


let monthsGenetive = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
];



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
    rtChartRecordInterval: 1, // seconds
    months: months,
    monthsGenetive: monthsGenetive,
    archiveDateMin: new Date(2000, 0, 1),
    appId: "794D66AB-D85B-4CD5-9FFF-F8763D9FDC39",
    memoryArchiveEnabled: true,
    localArchiveEnabled: true,
    remoteArchiveEnabled: false,
    loggerFolder: 'Log',
};
