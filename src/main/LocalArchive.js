const sqlite3 = require('sqlite3');
const Constants = require('../common/Constants');
const GlobalStorage = require('../common/GlobalStorage');
const MainEventManager = require('../common/MainEventManager')
const EventManager = require('../common/EventManager');
const path = require('path');
const DeviceData = require('../common/DeviceData');
const Measures = require('../common/Measures');

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
    constructor () {
        this.name = 'local';
        this.eventManager = new EventManager();
        this.opened = false;
        this.dbPath = undefined;
        this.db = undefined;
        this.openSequence = this.createOpenSequence();
        this.openError = false;
        this.onOpen = this.onOpen.bind(this);
        this.eventManager.subscribe('open', this.onOpen);
    }


    createOpenSequence () {
        let goNext = function (command, ...restArgs) {
            new Promise(() => {
                this.eventManager.publish('open', command, ...restArgs)
            });
        }.bind(this);

        let goError = function (...restArgs) {
            goNext('error', ...restArgs);
        }.bind(this);

        let commandStart = function () {
            goNext('close-old');
        }.bind(this);

        let commandCloseOld = function () {
            this.close();
            goNext('open-or-create');
        }.bind(this);

        let commandOpenOrCreate = function () {
            this.dbPath = path.join(globalStorage.homeDir, dbName);
            mainEventManager.publish('to-console', this.dbPath);
            this.db = new sqlite3.Database(this.dbPath, err => {
                err ? goError(err)
                    : goNext('properties-table-begin')
            });
        }.bind(this);

        let commandPropertiesTableBegin = function () {
            this.db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
              [propertiesTableName], (err, rows) => {
                  err ? goError(err)
                      : goNext(rows.length
                                ? 'properties-table-check'
                                : 'properties-table-create');
            });
        }.bind(this);

        let commandPropertiesTableCreate = function () {
            this.db.run('CREATE TABLE ' + propertiesTableName + ' (Key TEXT, Value TEXT)',
              [], (err) => {
                  err ? goError(err)
                      : goNext('properties-table-fill');
            });
        }.bind(this);

        let commandPropertiesTableFill = function () {
            let data = [
                ['AppId', Constants.appId],
                ['DbVersion', dbVersion]
            ];
            let placeholders = data.map(() => '(?,?)').join(',');
            this.db.run('INSERT INTO ' + propertiesTableName + '(Key,Value) VALUES ' + placeholders,
              data.flat(), err => {
                  err ? goError(err)
                      : goNext('properties-table-end');
            });
        }.bind(this);

        let commandPropertiesTableCheck = function () {
            this.db.all('SELECT Key, Value FROM ' + propertiesTableName, [], (err, rows) => {
                if (err) {
                    goError(err);
                } else {
                    let properties = {};
                    rows.forEach(item => {
                        properties[item.Key] = item.Value;
                    });

                    if (properties['AppId'] !== Constants.appId) {
                        goError('Wrong Application Id');
                    } else if (properties['DbVersion'] !== dbVersion) {
                        goError('Wrong DB Version');
                    } else {
                        goNext('properties-table-end');
                    }
                }
            });
        }.bind(this);

        let commandPropertiesTableEnd = function () {
            goNext('measures-table-begin');
        }.bind(this);

        let commandMeasuresTableBegin = function () {
            this.db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
              [measuresTableName], (err, rows) => {
                  err ? goError(err)
                      : goNext(rows.length
                                  ? 'measures-table-end'
                                  : 'measures-table-create');
            });
        }.bind(this);

        let commandMeasuresTableCreate = function () {
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
              [], err => {
                  err ? goError(err)
                      : goNext('measures-table-end');
            });
        }.bind(this);

        let commandMeasuresTableEnd = function () {
            //goNext('pipes-table-begin');
            goNext('delete-all');
            //goNext('success');
        }.bind(this);

        let commandDeleteAll = function () {
            this.deleteAll((result, err) => {
                if (result === 'success')
                  goNext('write-dummy-measures');
                else
                  goError(err);
            });
        }.bind(this);

        let commandWriteDummyMeasures = function () {
            this.writeDummyMeasures(() => {
                goNext('success');
            });
        }.bind(this);

        let commandError = function (...args) {
            this.opening = false;
            this.openError = true;
            this.close();
            let callback = this.openSequence.callback;
            this.failure(callback, ...args);
        }.bind(this);

        let commandSuccess = function () {
            this.opened = true;
            this.openening = false;
            this.readDateFrom();
            this.success(this.openSequence.callback);
        }.bind(this);

        return {
            'start': commandStart,
            'close-old': commandCloseOld,
            'open-or-create': commandOpenOrCreate,
            'properties-table-begin': commandPropertiesTableBegin,
            'properties-table-create': commandPropertiesTableCreate,
            'properties-table-fill': commandPropertiesTableFill,
            'properties-table-check': commandPropertiesTableCheck,
            'properties-table-end': commandPropertiesTableEnd,
            'measures-table-begin': commandMeasuresTableBegin,
            'measures-table-create': commandMeasuresTableCreate,
            'measures-table-end': commandMeasuresTableEnd,
            'delete-all': commandDeleteAll,
            'write-dummy-measures': commandWriteDummyMeasures,
            'error': commandError,
            'success': commandSuccess
        };
    }


    success (callback, ...restArgs) {
        callback && callback('success', ...restArgs);
    }


    failure (callback, error) {
        callback && callback('failure', error);
    }


    async onOpen (event, command, ...restArgs) {
        mainEventManager.publish('to-console', "ARCHIVE COMMAND: " + command);
        let commandFunc = this.openSequence[command];
        commandFunc && commandFunc(...restArgs);
    }


    open (callback) {
        if (this.openError || this.opened || this.opening) {
            return;
        }

        this.opening = true;
        this.openSequence.callback = callback;
        this.eventManager.publish('open', 'start');

/*
        let onOpen = function(event, command, ...restArgs) {
            mainEventManager.publish('to-console', command);

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
                    }*/

                  //  /*this.deleteAll((result) => {
                //        mainEventManager.publish('to-console', result);
                //    });
                //    this.delete(new Date(), (result) => {
              //          mainEventManager.publish('to-cosole', result);
                //    });*/
              /*      break;

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
        goNext('start');*/
    }


    close () {
        this.opened = false;
        if (this.db) {
            let db = this.db;
            this.db = undefined;
            db.close();
        }
    }


    isOpened () {
        return this.opened;
    }


    read (dateFrom, dateTo, callback) {
        if (!this.isOpened()) {
            this.failure(callback, 'Not opened');
            return;
        }

        if (!this.measuresTableSelectPattern) {
            this.measuresTableSelectPattern = 'SELECT * FROM '
              + measuresTableName + ' WHERE  Dt >= ? AND Dt <= ?';
        }

        this.db.all(this.measuresTableSelectPattern,
          [dateFrom, dateTo], (err, rows) => {
            if (err) {
                callback('error', err);
                return;
            }

            let results = new Measures();

            if (rows !== undefined) {
                for (let record of rows) {
                    results.date.push(new Date(record['Dt']));
                    results.inductorTemperature1.push(record['InductorTemperature1']);
                    results.inductorTemperature2.push(record['InductorTemperature2']);
                    results.thermostatTemperature1.push(record['ThermostatTemperature1']);
                    results.thermostatTemperature2.push(record['ThermostatTemperature2']);
                    results.sprayerTemperature.push(record['SprayerTemperature']);
                    results.heatingTemperature.push(record['HeatingTemperature']);
                    results.waterFlow.push(record['WaterFlow']);
                }
            }

            this.success(callback, results);
        });
    }


    writeDummyMeasures (callback) {
        let measuresList = [];

        let addSeconds = function (dt, seconds) {
            return new Date(dt.getTime() + seconds*1000);
        };
        let addMinutes = function (dt, minutes) {
            return addSeconds(dt, minutes*60);
        };

        let nextDate = addSeconds(new Date(), -5);
        for (let i = 0; i < 100; i++) {
            let measures = new Measures();
            measures.date = nextDate;
            measures.inductorTemperature1 = 450;
            measures.inductorTemperature2 = 550;
            measures.thermostatTemperature1 = 650;
            measures.thermostatTemperature2 = 750;
            measures.sprayerTemperature = 850;
            measures.heatingTemperature = 950;
            measures.waterFlow = 150;
            measuresList.push(measures);
            nextDate = addSeconds(nextDate, -1);
        }

        this.appendMeasures (measuresList, () => {
            this.success(callback);
        });
    }


    appendMeasures (newMeasures, callback) {
        /*if ( !this.isOpened() ) {
            callback('failure', 'not opened');
            return;
        }*/

        if (!newMeasures || !newMeasures.length) {
            this.success(callback);
            return;
        }

        if (!this.measuresTableInsertPattern) {
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
            this.measuresTableInsertPattern = 'INSERT OR REPLACE INTO '
              + measuresTableName + ' VALUES ';
            this.measuresTableInsertPlaceholders =
              '(' + fields.map(() => '?').join(',') + ')';
        }

        let query = this.measuresTableInsertPattern +
          newMeasures.map(() => this.measuresTableInsertPlaceholders).join(',');
        let records = newMeasures.map(item => [
            item.date.getTime(),
            item.inductorTemperature1,
            item.inductorTemperature2,
            item.thermostatTemperature1,
            item.thermostatTemperature2,
            item.sprayerTemperature,
            item.heatingTemperature,
            item.waterFlow
        ]).flat();
        this.db.run(query, records, err => {
            if (err) {
              this.failure(callback, err);
            }
            else {
              this.success(callback);
            }
        });
    }


    delete (dateTo, callback) {
        if (!this.isOpened()) {
            this.failure(callback, 'Not opened');
            return;
        }

        if (!this.tableDeletePatterns) {
            this.tableDeletePatterns = [
              'DELETE FROM ' + measuresTableName  + ' WHERE Dt < ?',
              //'DELETE FROM ' + pipesTableName + ' WHERE DtStart < ?',
              //'DELETE FROM ' + availableDatesTableName + ' WHERE Dt < ?'
            ];
        }
/*

        let deleteData = (index) => {
            index = index ?? 0;
            this.db.run(this.tableDeletePatterns[index], [dateTo.getTime()], (err) => {
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

        deleteData();*/
    }


    deleteAll (callback) {
        let tableNames = [measuresTableName,
//                          pipesTableName,
//                          availableDatesTableName
                         ];
        var resultCount = 0;
        let clearTables = function () {
            tableNames.forEach(name => {
              this.db.run("DELETE FROM " + name, [], err => {
                  if (err) {
                      mainEventManager.publish('to-console',
                        'ERROR (delete all from local storage). ' + err.toString());
                  }
                  if (++resultCount === tableNames.length) {
                      this.success(callback);
                  }
              });
            });
        }.bind(this);

        clearTables();
    }


    getDateFrom () {
        return this.dateFrom;
    }


    readDateFrom () {
        if (!this.isOpened()) {
            return;
        }

        let self = this;

        this.db.get("SELECT MIN(Dt) FROM " + measuresTableName, [], (err, row) => {
            if (!err && row !== undefined) {
                self.dateFrom =  new Date(row['MIN(Dt)']);
            }
        });
    }
}

module.exports = LocalArchive;
