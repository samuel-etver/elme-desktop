const electron = require('electron');
const ipc = electron.ipcRenderer;

let config = {};
let deviceIpEdit;
let devicePortEdit;
let serverIpEdit;

window.onload = function () {
    let getEl = id => document.getElementById(id);

    let okButton = getEl('button-ok');
    okButton.addEventListener('click', onOkButtonClick);
    let cancelButton = getEl('button-cancel');
    cancelButton.addEventListener('click', onCancelButtonClick);
    deviceIpEdit = getEl('input-device-ip');
    devicePortEdit = getEl('input-device-port');
    serverIpEdit = getEl('input-server-ip');

    config = ipc.sendSync('global-get', [
        'deviceIp',
        'devicePort',
        'serverIp'
    ]);
    deviceIpEdit.value = config.deviceIp;
    devicePortEdit.value = config.devicePort;
    serverIpEdit.value = config.serverIp;
};

function onOkButtonClick () {
    config.deviceIp = deviceIpEdit.value;
    config.devicePort = devicePortEdit.value;
    config.serverIp = serverIpEdit.value;
    closeWindow('ok');
}

function onCancelButtonClick () {
    closeWindow('cancel');
}


function closeWindow (closeType) {
    ipc.send('options-window-close', closeType, config);
}
