'use strict';

const modbus = require('jsmodbus');
const net = require('net');
const Constants = require('../common/Constants');
const GlobalStorage = require('../common/GlobalStorage');
const MainEventManager = require('../common/MainEventManager');
const DeviceData = require('../common/DeviceData');

const globalStorage = GlobalStorage.getInstance();
const mainEventManager = MainEventManager.getInstance();

var DeviceComm = (function() {
    let instance;
    let socket;
    let client;
    let timerId;
    let connected = false;


    function init() {
        mainEventManager.subscribe('app-load', start);
        mainEventManager.subscribe('app-close', stop);

        socket = new net.Socket();
        client = new modbus.client.TCP(socket, 1);

        socket.on('connect', onConnect);
        socket.on('error', onSocketError);

        return {
            isConnected: () => connected
        };
    }


    function start() {
        publish('device-start');
        reconnect();
    }


    function stop() {
        timerId && clearTimeout(timerId);
        publish('device-stop');
        socket.end();
    }


    function reconnect() {
        publish('device-reconnect');
        setTimeout(connect, 100);
    }


    function connect() {
      connected = false;
      publish('device-connect');
      let options = {
          'host': globalStorage.config.deviceIp,
          'port': globalStorage.config.devicePort
      };
      socket.connect(options);
    }


    function onConnect(...args) {
        connected = true;
        publish('device-connected', ...args);
        timerId = setTimeout(onTimer, Constants.deviceReadInterval);
    }


    function onSocketError(...args) {
        publish('device-error', ...args);
        reconnect();
    }


    function onTimer() {
        client.readInputRegisters(0, 50)
          .then(onReadSuccess)
          .catch(onReadError);
    }


    function onReadError(...args) {
        publish('device-read-error', ...args);
        reconnect();
    }


    function onReadSuccess(...args) {
        publish('device-read-success', ...args);

        let respBuff = args[0].response._body._valuesAsBuffer;
        var readF32 = function(offset) {
            let buff = Buffer.from([
                respBuff.readUInt8(offset + 1),
                respBuff.readUInt8(offset),
                respBuff.readUInt8(offset + 3),
                respBuff.readUInt8(offset + 2)
            ]);
            return buff.readFloatLE(0);
        };

        let inductorTemperature1 = readF32(0);
        let inductorTemperature2 = readF32(0);
        let thermostatTemperature1 = readF32(0);
        let thermostatTemperature2 = readF32(0);
        let sprayerTemperature = readF32(0);
        let heatingTemperature = readF32(0);
        let waterFlow = readF32(0);

        let deviceData = DeviceData.now();
        deviceData.inductorTemperature1 = inductorTemperature1;
        deviceData.inductorTemperature2 = inductorTemperature2;
        deviceData.thermostatTemperature1 = thermostatTemperature1;
        deviceData.thermostatTemperature2 = thermostatTemperature2;
        deviceData.sprayerTemperature = sprayerTemperature;
        deviceData.heatingTemperature = heatingTemperature;
        deviceData.waterFlow = waterFlow;

        globalStorage.deviceData = deviceData;

        publish('device-data-ready');

        timerId = setTimeout(onTimer, Constants.deviceReadInterval);
    }

    return {
        getInstance: function() {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }
    };
})();


var DeviceMock = (function() {
    let instance;
    let timerId;
    let connected = false;

    function init() {
        mainEventManager.subscribe('app-load', start);
        mainEventManager.subscribe('app-close', stop);

        return {
            isConnected: () => connected,
        }
    }

    function start() {
        publish('device-start');
        reconnect();
    }


    function stop() {
        timerId && clearTimeout(timerId);
        publish('device-stop');
    }


    function reconnect() {
        publish('device-reconnect');
        setTimeout(connect, 100);
    }


    function connect() {
      connected = false;
      publish('device-connect');
      onConnect();
    }


    function onConnect() {
        connected = true;
        publish('device-connected');
        timerId = setTimeout(onTimer, Constants.deviceReadInterval);
    }


    function onTimer() {
        onReadSuccess();
    }


    function onReadSuccess(...args) {
        publish('device-read-success', ...args);

        var generateValue = x => x + (10.0*Math.random() - 5);

        let currDate = new Date();
        let inductorTemperature1 = generateValue(400);
        let inductorTemperature2 = generateValue(500);
        let thermostatTemperature1 = generateValue(600);
        let thermostatTemperature2 = generateValue(700);
        let sprayerTemperature = generateValue(800);
        let heatingTemperature = generateValue(900);
        let waterFlow = generateValue(70);

        let deviceData = new DeviceData();
        deviceData.date = currDate;
        deviceData.inductorTemperature1 = inductorTemperature1;
        deviceData.inductorTemperature2 = inductorTemperature2;
        deviceData.thermostatTemperature1 = thermostatTemperature1;
        deviceData.thermostatTemperature2 = thermostatTemperature2;
        deviceData.sprayerTemperature = sprayerTemperature;
        deviceData.heatingTemperature = heatingTemperature;
        deviceData.waterFlow = waterFlow;

        globalStorage.deviceData = deviceData;

        publish('device-data-ready');

        timerId = setTimeout(onTimer, Constants.deviceReadInterval);
    }

    return {
        getInstance: function() {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }
    };
})();


(function() {
    let timerId;

    mainEventManager.subscribe('app-load', start);
    mainEventManager.subscribe('app-close', stop);
    mainEventManager.subscribe('device-data-ready', restart);


    function start() {
        timerId = setTimeout(watchdog, 10000);
    }


    function stop() {
        clearTimeout(timerId);
    }


    function restart() {
        if ( timerId !== undefined ) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(watchdog, 5000);
    }


    function watchdog() {
        globalStorage.deviceData = DeviceData.now();
        mainEventManager.publish('device-data-failure');
        restart();
    }
})();


var Device =  Constants.deviceMock
  ? DeviceMock
  : DeviceComm;
Device.getInstance();


function publish(event, ...args) {
    mainEventManager.publish(event, ...args);
}


module.exports = Device;
