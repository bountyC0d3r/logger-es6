import archiver from 'archiver-promise';
import fs from 'fs';
import fse from 'fs-extra';
import moment from 'moment';

class Logger {
    constructor(logFileName, errorFileName, logLevel, logRotation, logSize, logJson, logTimeStamp) {
        this.logFileName = logFileName;
        this.errorFileName = errorFileName;

        this.logLevel = logLevel;
        this.logRotation = logRotation;
        this.logSize = logSize;
        this.logJson = logJson;
        this.logTimeStamp = logTimeStamp;
    }

    static configure(properties) {
        let logLevel = properties.level || 'info';                         // Info
        let logRotation = properties.rotation || 'd';                      // Daily
        let logSize = properties.size * 1048576 || 5242880;                // 5 MB
        let logJson = properties.json || true;                             // True
        let logTimeStamp = properties.timeStamp || true;                   // True

        let logFileName = 'logs/app_log_current.log';
        let errorFileName = 'logs/err_log_current.log';

        this._createArchive();

        this._createLogFile(logFileName, logRotation, logSize);
        this._createLogFile(errorFileName, logRotation, logSize);

        return new Logger(logFileName, errorFileName, logLevel, logRotation, logSize, logJson, logTimeStamp);
    }

    static _createArchive() {
        let files = fs.readdirSync('logs/');

        if(files.length > 12) {
            let appLogFiles = files.filter(function (fileName) {
                return (!fileName.includes("current") && fileName.includes('app_log'))
            });

            if (appLogFiles.length > 0) {
                let logOutput = fs.createWriteStream('logs/log_archive.zip');
                let logArchive = archiver('zip', {
                    zlib: {level: 9}
                });
                logOutput.on('close', function () {
                    console.log(logArchive.pointer() + ' total bytes');
                    console.log('archiver has been finalized and the output file descriptor has closed.');
                });
                logArchive.on('error', function (err) {
                    throw err;
                });
                logArchive.pipe(logOutput);

                appLogFiles.forEach(function (fileName) {
                    logArchive.file('logs/' + fileName, {name: fileName});
                });

                logArchive.finalize().then(function(){
                    appLogFiles.forEach(function (fileName) {
                        fse.removeSync('logs/' + fileName)
                    });
                });
            }

            let errLogFiles = files.filter(function (fileName) {
                return (!fileName.includes("current") && fileName.includes('err_log'))
            });

            if (errLogFiles.length > 0) {
                let errorOutput = fs.createWriteStream('logs/err_archive.zip');
                let errorArchive = archiver('zip', {
                    zlib: {level: 9}
                });
                errorOutput.on('close', function () {
                    console.log(errorArchive.pointer() + ' total bytes');
                    console.log('archiver has been finalized and the output file descriptor has closed.');
                });
                errorArchive.on('error', function (err) {
                    throw err;
                });
                errorArchive.pipe(errorOutput);

                errLogFiles.forEach(function (fileName) {
                    errorArchive.file('logs/' + fileName, {name: fileName});
                });

                errorArchive.finalize().then(function(){
                    errLogFiles.forEach(function (fileName) {
                        fse.removeSync('logs/' + fileName)
                    });
                });
            }
        }
    }

    static _createLogFile(fileName, logRotation, logSize) {
        fse.ensureFileSync(fileName);

        fs.stat(fileName, function (err, stat) {
            let today = moment(moment(), 'M/D/YYYY');
            let fileDate = moment(moment(stat.birthtime), 'M/D/YYYY');
            let diffHours = today.diff(fileDate, 'hours');

            let temp = fileName.replace('current', moment(stat.birthtime).format('MM_DD_YYYY'));

            switch (logRotation) {
                case 'd':
                    if (parseInt(diffHours) > 1 || parseInt(stat.size / 1048576) > logSize) {
                        fs.rename(fileName, temp, function (err) {
                            if (err) console.log('ERROR: ' + err);
                            fse.ensureFile(fileName)
                                .then(() => {
                                    //
                                })
                                .catch(err => {
                                    // handle error
                                })
                        });
                    }
                    break;
                case 'w':
                    if (parseInt(diffHours) > 168 || parseInt(stat.size / 1048576) > logSize) {
                        fs.rename(fileName, temp, function (err) {
                            if (err) console.log('ERROR: ' + err);
                            fse.ensureFile(fileName)
                                .then(() => {
                                    //
                                })
                                .catch(err => {
                                    // handle error
                                })
                        });
                    }
                    break;
                case 'm':
                    if ((today.month() !== moment(stat.birthtime).month()) || parseInt(stat.size / 1048576) > logSize) {
                        fs.rename(fileName, temp, function (err) {
                            if (err) console.log('ERROR: ' + err);
                            fse.ensureFile(fileName)
                                .then(() => {
                                    //
                                })
                                .catch(err => {
                                    // handle error
                                })
                        });
                    }
                    break;
            }
        });

    }

    _checkFileSize(fileName, logSize) {
        fs.stat(fileName, function (err, stat) {
            if (parseInt(stat.size / 1048576) > logSize) {
                fs.rename(fileName, fileName.replace('current', moment(stat.birthtime).format('MM_DD_YYYY')), function (err) {
                    if (err) console.log('ERROR: ' + err);
                    fse.ensureFile(fileName)
                        .then(() => {
                            //
                        })
                        .catch(err => {
                            // handle error
                        })
                });
            }
        });
    }


    info(infoMessage) {
        let logData = {};
        logData['LEVEL'] = this.logLevel;
        logData['MESSAGE'] = infoMessage;
        logData['TIMESTAMP'] = moment(moment(), 'M/D/YYYY');

        this._checkFileSize(this.logFileName, this.logSize);

        fs.appendFile(this.logFileName, JSON.stringify(logData, null, 4) + '\r\n', function (err) {
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

        this._checkFileSize(this.logFileName, this.logSize);


        fs.appendFile(this.logFileName, JSON.stringify(logData, null, 4) + '\r\n', function (err) {
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

        this._checkFileSize(this.errorFileName, this.logSize);

        fs.appendFile(this.errorFileName, JSON.stringify(logData, null, 4) + '\r\n', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
}

export default Logger;

