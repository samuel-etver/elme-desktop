const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');
const Constants = require('../common/Constants');
const GlobalStorage = require('../common/GlobalStorage');
const MainEventManager = require('../common/MainEventManager');
const Config = require('./Config');
const DeviceComm = require('./DeviceComm');
const Archive = require('./Archive');
const AlertsStorage = require('./AlertsStorage');
const MainLogger = require('./MainLogger');
const FileLoggerHandler = require('./FileLoggerHandler');

var mainEventManager;
var globalStorage;
var mainLogger;
var deviceComm;
var mainWindow;
var archive;


init();
loadConfig();
saveConfig();

function createWindow() {
    mainWindow = new BrowserWindow(
      {
        width: 1100,
        height: 800,
        webPreferences: {
        //  preload: path.join(__dirname, 'preload.js'),
          nodeIntegration: true
        }
      }
    );
    globalStorage.mainWindow = mainWindow;

    mainWindow.loadURL(isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on('closed', () => (mainWindow = null));

    mainWindow.send('app-load');
    mainEventManager.publish('app-load');
    mainEventManager.subscribe('device-data-ready', onDeviceDataReady);
    mainEventManager.subscribe('device-data-failure', onDeviceDataFailure);

    ipc.on('log', onLog);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    mainWindow.send('app-close');
    mainEventManager.publish('app-close');
    if ( process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if ( mainWindow === null ) {
        createWindow();
    }
});


function init() {
    mainEventManager = MainEventManager.getInstance();
    mainEventManager.subscribe('log', (event, arg) => console.log(arg));
    globalStorage = GlobalStorage.getInstance();
    globalStorage.homeDir = path.join(process.env.APPDATA,
                                      Constants.appName);
    globalStorage.configDir = globalStorage.homeDir;
    globalStorage.configFilePath = path.join(globalStorage.configDir,
                                             Constants.configFileName);
    globalStorage.loggerFolderPath = path.join(globalStorage.homeDir,
                                               Constants.loggerFolder);                                               
    mainLogger = MainLogger.getInstance();

    deviceComm = DeviceComm.getInstance();

    archive = Archive.getInstance();
    archive.onAppLoad();
}


function loadConfig() {
    let cfg = new Config();
    cfg.load(globalStorage.configFilePath);
    for (let key of Constants.configVars) {
        globalStorage.config[key] = cfg.get(key)||'';
    }
    globalStorage.config.devicePort = '502';
    globalStorage.config.deviceIp = '10.8.10.101';
}


function saveConfig() {
    if ( !fs.existsSync(globalStorage.configDir) )  {
        fs.mkdirSync(globalStorage.configDir, {recursive: true});
    }

    let cfg = new Config();
    for (let key of Constants.configVars) {
        cfg.set(key, globalStorage.config[key]);
    }
    cfg.save(globalStorage.configFilePath);
}


function onDeviceDataReady() {
    sendDeviceData();
}


function onDeviceDataFailure() {
    sendDeviceData();
}


function sendDeviceData() {
  mainWindow.send('device-data-ready', globalStorage.deviceData);
}


function onLog(event, arg) {
    console.log(arg);
    event.returnValue = null;
}
