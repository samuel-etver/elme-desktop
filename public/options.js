const electron = require('electron');
const ipc = electron.ipcRenderer;

let config = {};
let deviceIpEdit;
let devicePortEdit;
let serverIpEdit;
let serverPortEdit;


window.onload = function () {
    let getEl = id => document.getElementById(id);

    let okButton = getEl('button-ok');
    okButton.addEventListener('click', onOkButtonClick);
    let cancelButton = getEl('button-cancel');
    cancelButton.addEventListener('click', onCancelButtonClick);
    deviceIpEdit = getEl('input-device-ip');
    devicePortEdit = getEl('input-device-port');
    serverIpEdit = getEl('input-server-ip');
    serverPortEdit = getEl('input-server-port');

    config = ipc.sendSync('global-get', [
        'deviceIp',
        'devicePort',
        'serverIp',
        'serverPort'
    ]);
    deviceIpEdit.value = config.deviceIp;
    devicePortEdit.value = config.devicePort;
    serverIpEdit.value = config.serverIp;
    serverPortEdit.value = config.serverPort;

    window.addEventListener('keydown', event => {
        switch( event.key ) {
          case 'Escape':
            this.onCancelButtonClick();
            break;
        }
    });
};


function onOkButtonClick () {
    config.deviceIp = deviceIpEdit.value;
    config.devicePort = devicePortEdit.value;
    config.serverIp = serverIpEdit.value;
    config.serverPort = serverPortEdit.value;

    closeWindow('ok');
}


function onCancelButtonClick () {
    closeWindow('cancel');
}


function closeWindow (closeType) {
    ipc.send('options-window-close', closeType, config);
}
