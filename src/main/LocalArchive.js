const sqlite3 = require('sqlite3');
const Constants = require('../common/Constants');
const GlobalStorage = require('../common/GlobalStorage');
const MainEventManager = require('../common/MainEventManager')
const EventManager = require('../common/EventManager');
const path = require('path');

let globalStorage = GlobalStorage.getInstance();
let mainEventManager = MainEventManager.getInstance();
const dbName = Constants.appName + '.db';
const dbVersion = '1.0';
const propertiesTableName = 'Properties';
const measuresTableName = 'Measures';

class LocalArchive {
    constructor() {
        this.eventManager = new EventManager();
        this.opened = false;
        this.dbPath = undefined;
        this.db = undefined;
    }


    open() {
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
                                          ? 'measures-table-check'
                                          : 'measures-table-create');
                    });
                    break;

                case 'measures-table-create':
                    break;

                case 'measures-table-check':
                    break;

                default:
                    mainEventManager.publish('log', restArgs[0]);
                    ;
            }

        }.bind(this);

        this.eventManager.subscribe('open', onOpen);

        goNext('start');
    }


    close() {
        if ( this.opened ) {
            this.opened = false;
            this.db.close();
        }
        this.db = undefined;
    }


    isOpened() {
        return this.opened;
    }


    read() {

    }


    write() {

    }


    delete() {

    }
}

module.exports = LocalArchive;
