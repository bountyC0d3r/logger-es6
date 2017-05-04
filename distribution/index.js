'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _archiverPromise = require('archiver-promise');

var _archiverPromise2 = _interopRequireDefault(_archiverPromise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
    function Logger(logFileName, errorFileName, logLevel, logRotation, logSize, logJson, logTimeStamp) {
        _classCallCheck(this, Logger);

        this.logFileName = logFileName;
        this.errorFileName = errorFileName;

        this.logLevel = logLevel;
        this.logRotation = logRotation;
        this.logSize = logSize;
        this.logJson = logJson;
        this.logTimeStamp = logTimeStamp;
    }

    _createClass(Logger, [{
        key: '_checkFileSize',
        value: function _checkFileSize(fileName, logSize) {
            _fs2.default.stat(fileName, function (err, stat) {
                if (parseInt(stat.size / 1048576) > logSize) {
                    _fs2.default.rename(fileName, fileName.replace('current', (0, _moment2.default)(stat.birthtime).format('MM_DD_YYYY')), function (err) {
                        if (err) console.log('ERROR: ' + err);
                        _fsExtra2.default.ensureFile(fileName).then(function () {
                            //
                        }).catch(function (err) {
                            // handle error
                        });
                    });
                }
            });
        }
    }, {
        key: 'info',
        value: function info(infoMessage) {
            var logData = {};
            logData['LEVEL'] = this.logLevel;
            logData['MESSAGE'] = infoMessage;
            logData['TIMESTAMP'] = (0, _moment2.default)((0, _moment2.default)(), 'M/D/YYYY');

            this._checkFileSize(this.logFileName, this.logSize);

            _fs2.default.appendFile(this.logFileName, JSON.stringify(logData, null, 4) + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }, {
        key: 'debug',
        value: function debug(debugMessage, debugData) {
            var logData = {};
            logData['LEVEL'] = this.logLevel;
            logData['MESSAGE'] = debugMessage;
            logData['DETAILS'] = debugData;
            logData['TIMESTAMP'] = (0, _moment2.default)((0, _moment2.default)(), 'M/D/YYYY');

            this._checkFileSize(this.logFileName, this.logSize);

            _fs2.default.appendFile(this.logFileName, JSON.stringify(logData, null, 4) + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }, {
        key: 'error',
        value: function error(errorMessage, errorData) {
            var logData = {};
            logData['LEVEL'] = this.logLevel;
            logData['MESSAGE'] = errorMessage;
            logData['DETAILS'] = errorData;
            logData['TIMESTAMP'] = (0, _moment2.default)((0, _moment2.default)(), 'M/D/YYYY');

            this._checkFileSize(this.errorFileName, this.logSize);

            _fs2.default.appendFile(this.errorFileName, JSON.stringify(logData, null, 4) + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }], [{
        key: 'configure',
        value: function configure(properties) {
            var logLevel = properties.level || 'info'; // Info
            var logRotation = properties.rotation || 'd'; // Daily
            var logSize = properties.size * 1048576 || 5242880; // 5 MB
            var logJson = properties.json || true; // True
            var logTimeStamp = properties.timeStamp || true; // True

            var logFileName = 'logs/app_log_current.log';
            var errorFileName = 'logs/err_log_current.log';

            this._createArchive();

            this._createLogFile(logFileName, logRotation, logSize);
            this._createLogFile(errorFileName, logRotation, logSize);

            return new Logger(logFileName, errorFileName, logLevel, logRotation, logSize, logJson, logTimeStamp);
        }
    }, {
        key: '_createArchive',
        value: function _createArchive() {
            var files = _fs2.default.readdirSync('logs/');

            if (files.length > 12) {
                var appLogFiles = files.filter(function (fileName) {
                    return !fileName.includes("current") && fileName.includes('app_log');
                });

                if (appLogFiles.length > 0) {
                    var logOutput = _fs2.default.createWriteStream('logs/log_archive.zip');
                    var logArchive = (0, _archiverPromise2.default)('zip', {
                        zlib: { level: 9 }
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
                        logArchive.file('logs/' + fileName, { name: fileName });
                    });

                    logArchive.finalize().then(function () {
                        appLogFiles.forEach(function (fileName) {
                            _fsExtra2.default.removeSync('logs/' + fileName);
                        });
                    });
                }

                var errLogFiles = files.filter(function (fileName) {
                    return !fileName.includes("current") && fileName.includes('err_log');
                });

                if (errLogFiles.length > 0) {
                    var errorOutput = _fs2.default.createWriteStream('logs/err_archive.zip');
                    var errorArchive = (0, _archiverPromise2.default)('zip', {
                        zlib: { level: 9 }
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
                        errorArchive.file('logs/' + fileName, { name: fileName });
                    });

                    errorArchive.finalize().then(function () {
                        errLogFiles.forEach(function (fileName) {
                            _fsExtra2.default.removeSync('logs/' + fileName);
                        });
                    });
                }
            }
        }
    }, {
        key: '_createLogFile',
        value: async function _createLogFile(fileName, logRotation, logSize) {
            _fsExtra2.default.ensureFileSync(fileName);

            _fs2.default.stat(fileName, function (err, stat) {
                var today = (0, _moment2.default)((0, _moment2.default)(), 'M/D/YYYY');
                var fileDate = (0, _moment2.default)((0, _moment2.default)(stat.birthtime), 'M/D/YYYY');
                var diffHours = today.diff(fileDate, 'hours');

                var temp = fileName.replace('current', (0, _moment2.default)(stat.birthtime).format('MM_DD_YYYY'));

                switch (logRotation) {
                    case 'd':
                        if (parseInt(diffHours) > 1 || parseInt(stat.size / 1048576) > logSize) {
                            _fs2.default.rename(fileName, temp, function (err) {
                                if (err) console.log('ERROR: ' + err);
                                _fsExtra2.default.ensureFile(fileName).then(function () {
                                    //
                                }).catch(function (err) {
                                    // handle error
                                });
                            });
                        }
                        break;
                    case 'w':
                        if (parseInt(diffHours) > 168 || parseInt(stat.size / 1048576) > logSize) {
                            _fs2.default.rename(fileName, temp, function (err) {
                                if (err) console.log('ERROR: ' + err);
                                _fsExtra2.default.ensureFile(fileName).then(function () {
                                    //
                                }).catch(function (err) {
                                    // handle error
                                });
                            });
                        }
                        break;
                    case 'm':
                        if (today.month() !== (0, _moment2.default)(stat.birthtime).month() || parseInt(stat.size / 1048576) > logSize) {
                            _fs2.default.rename(fileName, temp, function (err) {
                                if (err) console.log('ERROR: ' + err);
                                _fsExtra2.default.ensureFile(fileName).then(function () {
                                    //
                                }).catch(function (err) {
                                    // handle error
                                });
                            });
                        }
                        break;
                }
            });
        }
    }]);

    return Logger;
}();

exports.default = Logger;