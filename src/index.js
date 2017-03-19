import fs from 'fs';
import moment from 'moment';

class Logger {
    // constructor() {}

    constructor(logFileName, errorFileName, logLevel, logRotation, logSize, logJson, logTimeStamp) {
        this.logFileName = logFileName;
        this.errorFileName = errorFileName;

        this.logLevel = logLevel;                         // Info
        this.logRotation = logRotation;                      // Daily
        this.logSize = logSize;      // 5 MB
        this.logJson = logJson;                             // True
        this.logTimeStamp = logTimeStamp;                   // True
    }

    static configure(properties) {
        let logLevel = properties.level || 'info';                         // Info
        let logRotation = properties.rotation || 'd';                      // Daily
        let logSize = properties.size * 1048576 || 5242880;      // 5 MB
        let logJson = properties.json || true;                             // True
        let logTimeStamp = properties.timeStamp || true;

        let logFileName = 'logs/app_log_current.log';
        let errorFileName = 'logs/error_log_current.log';

        if (!fs.existsSync('logs')){
            fs.mkdirSync('logs');
        }

        this._createLogFile(logFileName, logRotation, logSize);
        this._createLogFile(errorFileName, logRotation, logSize);

        return new Logger(logFileName, errorFileName, logLevel, logRotation, logSize, logJson, logTimeStamp);
    }

    static _createLogFile(fileName, logRotation, logSize) {
        fs.stat(fileName, function (err, stat) {
            if (err && err.code == 'ENOENT') {
                fs.open(fileName, 'a+', function (err, fd) {
                    if (err) {
                        return console.error(err);
                    }

                    fs.close(fd, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            } else if (err) {
                return console.error(err);
            }

            if (logRotation === 'd') {
                let today = moment(moment(), 'M/D/YYYY');
                let fileDate = moment(moment(stat.birthtime), 'M/D/YYYY');
                let diffHours = today.diff(fileDate, 'hours');

                if (parseInt(diffHours) - parseInt((moment().startOf('day').fromNow())) > 1) {
                    fs.rename(fileName, fileName + '.' + moment(stat.birthtime).format('MM_DD_YYYY'), function (err) {
                        if (err) console.log('ERROR: ' + err);

                        fs.open(fileName, 'a+', function (err, fd) {
                            if (err) {
                                return console.error(err);
                            }

                            fs.close(fd, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        });
                    });
                }
            }
        });
    }



    info(infoMessage) {
        let logData = {};
        logData['LEVEL'] = this.logLevel;
        logData['MESSAGE'] = infoMessage;
        logData['TIMESTAMP'] = moment(moment(), 'M/D/YYYY');

        fs.appendFile(this.logFileName, JSON.stringify(logData) + '\r\n', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }


    debug(debugMessage, debugData) {
        let logData = {};
        logData['LEVEL'] = this.logLevel;
        logData['MESSAGE'] = debugMessage;
        logData['DETAILS'] = debugData;
        logData['TIMESTAMP'] = moment(moment(), 'M/D/YYYY');

        fs.appendFile(this.logFileName, JSON.stringify(logData) + '\r\n', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }



    error(errorMessage, errorData) {
        let logData = {};
        logData['LEVEL'] = this.logLevel;
        logData['MESSAGE'] = errorMessage;
        logData['DETAILS'] = errorData;
        logData['TIMESTAMP'] = moment(moment(), 'M/D/YYYY');

        fs.appendFile(this.errorFileName, JSON.stringify(logData) + '\r\n', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }


}

export default Logger;

