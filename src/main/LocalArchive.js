const sqlite3 = require('sqlite3');
const Constants = require('../common/Constants');
const GlobalStorage = require('../common/GlobalStorage');
const MainEventManager = require('../common/MainEventManager')
const EventManager = require('../common/EventManager');
const path = require('path');
const DeviceDAte = require('../common/DeviceData');

let globalStorage = GlobalStorage.getInstance();
let mainEventManager = MainEventManager.getInstance();
const dbName = Constants.appName + '.db';
const dbVersion = '1.0';
const propertiesTableName = 'Properties';
const measuresTableName = 'Measures';
const pipesTableName = 'Pipes';
const availableDatesTableName = 'AvailableDates';
const measuresTableIndexName = 'MeasuresIndex';
const pipesTableIndexName = 'PipesIndex';
const availableDatesTableIndexName = 'AvailableDatesIndex';

class LocalArchive {
    constructor() {
        this.eventManager = new EventManager();
        this.opened = false;
        this.dbPath = undefined;
        this.db = undefined;
    }


    open(callback) {
        if ( this.opening ) {
            return;
        }

        this.opening = true;

        let goNext = function(command, ...restArgs) {
            new Promise(() => {
                this.eventManager.publish('open', command, ...restArgs)
            });
        }.bind(this);

        let goError = function(...restArgs) {
            goNext('error', ...restArgs);
        }.bind(this);

        let onOpen = function(event, command, ...restArgs) {
            mainEventManager.publish('log', command);

            switch(command) {
                case 'start':
                    goNext('close-old');
                    break;

                case 'close-old':
                    this.close();
                    goNext('open-or-create');
                    break;

                case 'open-or-create':
                    if ( !this.dbPath ) {
                        this.dbPath = path.join(globalStorage.homeDir, dbName);
                    }
                    this.db = new sqlite3.Database(this.dbPath, err => {
                        err ? goError(err) : goNext('properties-table-begin')
                    });
                    break;

                case 'properties-table-begin':
                    this.db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
                      [propertiesTableName], (err, rows) => {
                          err ? goError(err)
                              : goNext( rows.length
                                          ? 'properties-table-check'
                                          : 'properties-table-create');
                    });
                    break;

                case 'properties-table-create':
                    this.db.run('CREATE TABLE ' + propertiesTableName + ' (Key TEXT, Value TEXT)',
                      [], (err) => {
                          err ? goError(err) : goNext('properties-table-fill');
                    });
                    break;

                case 'properties-table-fill': {
                    let data = [
                        ['AppId', Constants.appId],
                        ['DbVersion', dbVersion]
                    ];
                    let placeholders = data.map(() => '(?,?)').join(',');
                    this.db.run('INSERT INTO ' + propertiesTableName + '(Key,Value) VALUES ' + placeholders,
                      data.flat(), (err) => {
                          err ? goError(err) : goNext('properties-table-end');
                    });
                    break;
                }

                case 'properties-table-check':
                    this.db.all('SELECT Key, Value FROM ' + propertiesTableName,
                      [], (err, rows) => {
                          if ( err ) {
                              goError(err);
                          } else {
                              let properties = {};
                              rows.forEach(item => {
                                  properties[item.Key] = item.Value;
                              });

                              if ( properties['AppId'] !== Constants.appId ) {
                                  goError('Wrong Application Id');
                              } else if ( properties['DbVersion'] !== dbVersion ) {
                                  goError('Wrong DB Version');
                              } else {
                                  goNext('properties-table-end');
                              }
                          }
                    });
                    break;

                case 'properties-table-end':
                    goNext('measures-table-begin');
                    break;

                case 'measures-table-begin':
                    this.db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
                      [measuresTableName], (err, rows) => {
                          err ? goError(err)
                              : goNext( rows.length
                                          ? 'measures-table-end'
                                          : 'measures-table-create');
                    });
                    break;

                case 'measures-table-create':
                    this.db.run('CREATE TABLE ' + measuresTableName
                      + ' (Dt INTEGER PRIMARY KEY'
                      + ',InductorTemperature1 REAL'
                      + ',InductorTemperature2 REAL'
                      + ',ThermostatTemperature1 REAL'
                      + ',ThermostatTemperature2 REAL'
                      + ',SprayerTemperature REAL'
                      + ',HeatingTemperature REAL'
                      + ',WaterFlow REAL'
                      + ')',
                      [], (err) => {
                          err ? goError(err) : goNext('measures-table-end');
                    });
                    break;

                case 'measures-table-end':
                    goNext('measures-table-index-begin');
                    break;

                case 'measures-table-index-begin':
                    this.db.all('PRAGMA index_list(' + measuresTableName + ')', [], (err, rows) => {
                        if ( err ) {
                            goError(err);
                        }
                        else {
                            let found = rows.find(record => record.name === measuresTableIndexName);
                            goNext(found ? 'measures-table-index-end' : 'measures-table-index-create');
                        }
                    });
                    break;

                case 'measures-table-index-create':
                    this.db.run('CREATE INDEX ' + measuresTableIndexName + ' ON '
                      + measuresTableName  + ' (Dt)', [], (err) => {
                        err ? goError(err) : goNext('measures-table-index-end');
                    });
                    break;

                case 'measures-table-index-end':
                    goNext('pipes-table-begin');
                    break;

                case 'pipes-table-begin':
                    this.db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
                      [pipesTableName], (err, rows) => {
                          err ? goError(err)
                              : goNext( rows.length
                                          ? 'pipes-table-end'
                                          : 'pipes-table-create');
                    });
                    break;

                case 'pipes-table-create':
                    this.db.run('CREATE TABLE ' + pipesTableName
                      + ' (DtStart INTEGER'
                      + ',DtStop  INTEGER'
                      + ')',
                      [], (err) => {
                          err ? goError(err) : goNext('pipes-table-end');
                    });
                    break;

                case 'pipes-table-end':
                    goNext('pipes-table-index-begin');
                    break;

                case 'pipes-table-index-begin':
                    this.db.all('PRAGMA index_list(' + pipesTableName + ')', [], (err, rows) => {
                        if ( err ) {
                            goError(err);
                        }
                        else {
                            let found = rows.find(record => record.name === pipesTableIndexName);
                            goNext(found ? 'pipes-table-index-end' : 'pipes-table-index-create');
                        }
                    });
                    break;

                case 'pipes-table-index-create':
                    this.db.run('CREATE INDEX ' + pipesTableIndexName + ' ON '
                      + pipesTableName  + ' (DtStart)', [], (err) => {
                        err ? goError(err) : goNext('pipes-table-index-end');
                    });
                    break;

                case 'pipes-table-index-end':
                    goNext('available-dates-table-begin');
                    break;

                case 'available-dates-table-begin':
                    this.db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
                      [availableDatesTableName], (err, rows) => {
                          err ? goError(err)
                              : goNext( rows.length
                                          ? 'available-dates-table-end'
                                          : 'available-dates-table-create');
                    });
                    break;

                case 'available-dates-table-create':
                    this.db.run('CREATE TABLE ' + availableDatesTableName
                      + ' (Dt INTEGER NOT NULL PRIMARY KEY'
                      + ',Hours INTEGER'
                      + ')',
                      [], (err) => {
                          err ? goError(err) : goNext('available-dates-table-end');
                    });
                    break;

                case 'available-dates-table-end':
                    goNext('available-dates-table-index-begin');
                    break;

                case 'available-dates-table-index-begin':
                    this.db.all('PRAGMA index_list(' + availableDatesTableName + ')', [], (err, rows) => {
                        if ( err ) {
                            goError(err);
                        }
                        else {
                            let found = rows.find(record => record.name === availableDatesTableIndexName);
                            goNext(found ? 'available-dates-table-index-end' : 'available-dates-table-index-create');
                        }
                    });
                    break;

                case 'available-dates-table-index-create':
                    this.db.run('CREATE INDEX ' + availableDatesTableIndexName + ' ON '
                      + availableDatesTableName  + ' (Dt)', [], (err) => {
                        err ? goError(err) : goNext('available-date-table-index-end');
                    });
                    break;

                case 'available-dates-table-index-end':
                    goNext('success');
                    break;

                case 'success':
                    this.opened = true;
                    this.openening = false;
                    if ( callback ) {
                        callback('success');
                    }

                    /*this.deleteAll((result) => {
                        mainEventManager.publish('log', result);
                    });
                    this.delete(new Date(), (result) => {
                        mainEventManager.publish('log', result);
                    });*/
                    break;

                case 'error':
                    this.opening = false;
                    this.close();
                    if ( callback ) {
                        callback('failure', ...restArgs);
                    }

                default: ;
            }
        }.bind(this);

        this.eventManager.subscribe('open', onOpen);
        goNext('start');
    }


    close() {
        this.opened = false;
        if ( this.db ) {
            let db = this.db;
            this.db = undefined;
            db.close();
        }
    }


    isOpened() {
        return this.opened;
    }


    read(fromDate, toDate, callback) {
        if ( !this.isOpened() ) {
            callback('failure', 'not opened');
            return;
        }

        if ( !this.measuresTableSelectPattern ) {
            this.measuresTableSelectPattern = 'SELECT * FROM '
              + measuresTableName
              + ' WHERE  Dt >= ? AND Dt <= ?'
        }

        this.db.all(this.measuresTableSelectPattern,
          [fromDate, toDate], (err, rows) => {
            if ( err ) {
                callback('error', err);
                return;
            }


            let results = [];

            for (let record of rows) {
                let deviceData = new DeviceData();
                deviceData.date = record['Dt'];
                deviceData.inductorTemperature1 = record['InductorTemperature1'];
                deviceData.inductorTemperature2 = record['InductorTemperature2'];
                deviceData.thermostatTemperature1 = record['ThermostatTemperature1'];
                deviceData.thermostatTemperature2 = record['ThermostatTemperature2'];
                deviceData.sprayerTemperature = record['SprayerTemperature'];
                deviceData.heatingTemperature = record['HeatingTemperature'];
                deviceData.waterFlow = record['WaterFlow'];
                results.push(deviceData);
            }

            callback('success', results);
        });
    }


    write(data, callback) {
        if ( !this.isOpened() ) {
            callback('failure', 'not opened');
            return;
        }

        if ( !data || !data.length ) {
            callback('success');
            return;
        }

        if ( !this.measuresTableInsertPattern ) {
            let fields = [
                'Dt',
                'InductorTemperature1',
                'InductorTemperature2',
                'ThermostatTemperature1',
                'ThermostatTemperature2',
                'SprayerTemperature',
                'HeatingTemperature',
                'WaterFlow'
            ];
            this.measureTableInsertPattern = 'INSERT OR REPLACE INTO '
              + measuresTableName
              + ' (' + fields.join(',') + ') VALUES ';
            this.measureTableInsertRecordPlaceholders =
              '(' + fields.map(() => '?').join(',') + ')';
        }

        let query = this.measureTableInsertPattern +
          data.map(() => this.measureTableInsertRecordPlaceholders).join(',');
        let records = data.map(item =>
            [
                item.date.getTime(),
                item.inductorTemperature1,
                item.inductorTemperature2,
                item.thermostatTemperature1,
                item.thermostatTemperature2,
                item.sprayerTemperature,
                item.heatingTemperature,
                item.waterFlow
            ]
        );

        this.db.run(query, records.flat(), (err) => {
            if ( callback ) {
                callback(err ? 'failure' : 'success', err);
            }
        });
    }


    delete(toDate, callback) {
        if ( !this.isOpened() ) {
            callback('failure');
            return;
        }

        if ( !this.tableDeletePatterns ) {
            this.tableDeletePatterns = [
              'DELETE FROM ' + measuresTableName  + ' WHERE Dt < ?',
              'DELETE FROM ' + pipesTableName + ' WHERE DtStart < ?',
              'DELETE FROM ' + availableDatesTableName + ' WHERE Dt < ?'
            ];
        }


        let deleteData = (index) => {
            index = index ?? 0;
            this.db.run(this.tableDeletePatterns[index], [toDate.getTime()], (err) => {
                if ( err ) {
                    callback('failure', err);
                }
                else {
                    this.tableDeletePatterns.length - 1 > index
                      ? deleteData(index + 1)
                      : callback('success');
                }
            });
        }

        deleteData();
    }


    deleteAll(callback) {
        if ( !this.isOpened() ) {
            callback('failure');
            return;
        }

        let tableNames = [measuresTableName,
                          pipesTableName,
                          availableDatesTableName
                         ];
        let clearTables = (index) => {
            index = index ?? 0;
            this.db.run("DELETE FROM " + tableNames[index], [], (err) => {
                if ( err ) {
                    callback('failure', err);
                }
                else {
                    tableNames.length - 1 > index
                      ? clearTables(index + 1)
                      : callback('success');
                }
            });
        }

        clearTables();
    }
}

module.exports = LocalArchive;
