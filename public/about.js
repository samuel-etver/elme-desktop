const electron = window.require('electron');
const ipc = electron.ipcRenderer;

window.onload = () => {
    let closeButton = document.getElementById("button-close");
    closeButton.addEventListener('click', onCloseClick);
}


function onCloseClick() {
    ipc.send("about-window-close");
}
