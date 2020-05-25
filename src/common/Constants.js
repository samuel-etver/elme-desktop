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
};
