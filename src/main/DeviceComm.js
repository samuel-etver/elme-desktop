'use strict';

const modbus = require('jsmodbus');
const net = require('net');
const Constants = require('../common/Constants');
const GlobalStorage = require('../common/GlobalStorage');
const MainEventManager = require('../common/MainEventManager');
const DeviceData = require('../common/DeviceData');

var DeviceComm = (function() {
    let instance;
    let socket;
    let client;
    let globalStorage = GlobalStorage.getInstance();
    let eventManager = MainEventManager.getInstance();
    let timerId;
    let connected = false;


    function init() {
        eventManager.subscribe('app-load', start);
        eventManager.subscribe('app-close', stop);

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
        timerId && clearTimer(timerId);
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

        let currDate = new Date();
        let inductorTemperature1 = readF32(0);
        let inductorTemperature2 = readF32(0);
        let thermostatTemperature1 = readF32(0);
        let thermostatTemperature2 = readF32(0);
        let sprayerTemperature = readF32(0);
        let heatingTemperature = readF32(0);
        let waterFlow = readF32(0);

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


    function publish(event, ...args) {
        eventManager.publish(event, ...args);
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
    DeviceComm.getInstance();
})();


module.exports = DeviceComm;
