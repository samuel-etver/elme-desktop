const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
/*const modbus = require('jsmodbus');
const net = require('net');
const socket = new net.Socket();
const options = {
  'host': '10.8.10.101',
  'port': '502'
}
const client = new modbus.client.TCP(socket, 1);

socket.on('connect', function () {
  console.log('CONNECTEd');
  client.readInputRegisters(
    0, 50
    )
    .then(function (resp) {
      console.log("READ!");
      let buf =  resp.response._body._valuesAsBuffer;
      buf = Buffer.from([buf.readUInt8(1), buf.readUInt8(0), 0x99, 0x42])
      console.log(buf.readFloatLE(0));
      setTimeout(() => {
        client.readInputRegisters(
          0, 50
        ).then(function(resp) {
          let buf =  resp.response._body._valuesAsBuffer;
          buf = Buffer.from([buf.readUInt8(1), buf.readUInt8(0), 0x99, 0x42])
          console.log(buf.readFloatLE(0) + 1);
        });
      }, 1000);
    }).catch(function () {
      console.log("ERROR!");
      console.error(arguments)
      socket.end()
    });
});

socket.on('error', console.error)
socket.connect(options);
*/
var mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow(
    {
      width: 600,
      height: 500,
      webPreferences: {
      //  preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
      }
    }
  );

  mainWindow.loadURL(isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if ( process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if ( mainWindow === null ) {
    createWindow();
  }
});
