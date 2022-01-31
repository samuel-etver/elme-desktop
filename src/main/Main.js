const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');
const Constants = require('../common/Constants');
const GlobalStorage = require('../common/GlobalStorage');
const MainEventManager = require('../common/MainEventManager');
const Config = require('./Config');
const DeviceComm = require('./DeviceComm');
const RtRemoteComm = require('./RtRemoteComm');
const Archive = require('./Archive');
const AlertsStorage = require('./AlertsStorage');
const MainLogger = require('./MainLogger');
const FileLoggerHandler = require('./FileLoggerHandler');

let mainEventManager;
let globalStorage;
let mainLogger;
let deviceComm;
let mainWindow;
let optionsWindow;
let aboutWindow;
let archive;


init();
loadConfig();

function createWindow () {
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

    ipc.on('to-console', (event, arg) => {
        console.log(arg);
        event.returnValue = null;
    });
    ipc.on('global-get', onGlobalGet);


    let mainMenu = Menu.buildFromTemplate([
        {
            label: "Файл",
            submenu: [
                {
                    label: "Настройки...",
                    click: onOptionsClick
                },
                {
                    type: 'separator'
                },
                {
                    label: "Выход",
                    click: onExitClick
                }
            ]
        },
        {
            label: "Справка",
            submenu: [
                {
                    label: "О программе...",
                    click: onAboutClick
                }
            ]
        }
    ]);
    mainWindow.setMenu(mainMenu);
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
    if (mainWindow === null) {
        createWindow();
    }
});


function init () {
    mainEventManager = MainEventManager.getInstance();
    mainEventManager.subscribe('to-console', (event, arg) => console.log(arg));
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


function loadConfig () {
    let cfg = new Config();
    cfg.load(globalStorage.configFilePath);
    for (let key of Constants.configVars) {
        globalStorage.config[key] = cfg.get(key)||'';
    }
    globalStorage.config.devicePort = '502';
    globalStorage.config.deviceIp = '10.8.10.101';
}


function saveConfig () {
    if (!fs.existsSync(globalStorage.configDir))  {
        fs.mkdirSync(globalStorage.configDir, {recursive: true});
    }

    let cfg = new Config();
    for (let key of Constants.configVars) {
        cfg.set(key, globalStorage.config[key]);
    }
    cfg.save(globalStorage.configFilePath);
}


function onDeviceDataReady () {
    sendDeviceData();
}


function onDeviceDataFailure () {
    sendDeviceData();
}


function sendDeviceData () {
    mainWindow.send('device-data-ready', globalStorage.deviceData);
}


function onOptionsClick () {
    optionsWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        center: true,
        resizable: false,
        minimizable: false,
        width: 300,
        height: 400,
        webPreferences: {
          nodeIntegration: true
        }
    });
    optionsWindow.removeMenu ();
    optionsWindow.loadFile('./public/options.html');
    ipc.removeListener('options-window-close', onCloseOptionsWindow);
    ipc.once('options-window-close', onCloseOptionsWindow);
}


function onCloseOptionsWindow (event, closeType, config) {
    optionsWindow.close();
    optionsWindow = undefined;
    if (closeType === 'ok') {
        Object.assign(globalStorage.config, config);
        saveConfig();
    }
}


function onAboutClick () {
    aboutWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        center: true,
        resizable: false,
        minimizable: false,
        width: 400,
        height: 500,
        webPreferences: {
          nodeIntegration: true
        }
    });
    aboutWindow.removeMenu ();
    aboutWindow.loadFile(`./public/about.html`);
    ipc.removeListener('about-window-close', onCloseAboutWindow);
    ipc.once('about-window-close', onCloseAboutWindow);
}


function onCloseAboutWindow () {
    aboutWindow.close();
    aboutWindow = undefined;
}


function onExitClick () {
    app.quit();
}


function onGlobalGet (event, args) {
    let data = {};
    for (item of args) {
        data[item] = globalStorage.config[item];
    }
    event.returnValue = data;
}
