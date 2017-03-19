'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
    // constructor() {}

    function Logger(logFileName, errorFileName, logLevel, logRotation, logSize, logJson, logTimeStamp) {
        _classCallCheck(this, Logger);

        this.logFileName = logFileName;
        this.errorFileName = errorFileName;

        this.logLevel = logLevel; // Info
        this.logRotation = logRotation; // Daily
        this.logSize = logSize; // 5 MB
        this.logJson = logJson; // True
        this.logTimeStamp = logTimeStamp; // True
    }

    _createClass(Logger, [{
        key: 'info',
        value: function info(infoMessage) {
            var logData = {};
            logData['LEVEL'] = this.logLevel;
            logData['MESSAGE'] = infoMessage;
            logData['TIMESTAMP'] = (0, _moment2.default)((0, _moment2.default)(), 'M/D/YYYY');

            _fs2.default.appendFile(this.logFileName, JSON.stringify(logData) + '\r\n', function (err) {
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

            _fs2.default.appendFile(this.logFileName, JSON.stringify(logData) + '\r\n', function (err) {
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

            _fs2.default.appendFile(this.errorFileName, JSON.stringify(logData) + '\r\n', function (err) {
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
            var logTimeStamp = properties.timeStamp || true;

            var logFileName = 'logs/app_log_current.log';
            var errorFileName = 'logs/error_log_current.log';

            if (!_fs2.default.existsSync('logs')) {
                _fs2.default.mkdirSync('logs');
            }

            this._createLogFile(logFileName, logRotation, logSize);
            this._createLogFile(errorFileName, logRotation, logSize);

            return new Logger(logFileName, errorFileName, logLevel, logRotation, logSize, logJson, logTimeStamp);
        }
    }, {
        key: '_createLogFile',
        value: function _createLogFile(fileName, logRotation, logSize) {
            _fs2.default.stat(fileName, function (err, stat) {
                if (err && err.code == 'ENOENT') {
                    _fs2.default.open(fileName, 'a+', function (err, fd) {
                        if (err) {
                            return console.error(err);
                        }

                        _fs2.default.close(fd, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                } else if (err) {
                    return console.error(err);
                }

                if (logRotation === 'd') {
                    var today = (0, _moment2.default)((0, _moment2.default)(), 'M/D/YYYY');
                    var fileDate = (0, _moment2.default)((0, _moment2.default)(stat.birthtime), 'M/D/YYYY');
                    var diffHours = today.diff(fileDate, 'hours');

                    if (parseInt(diffHours) - parseInt((0, _moment2.default)().startOf('day').fromNow()) > 1) {
                        _fs2.default.rename(fileName, fileName + '.' + (0, _moment2.default)(stat.birthtime).format('MM_DD_YYYY'), function (err) {
                            if (err) console.log('ERROR: ' + err);

                            _fs2.default.open(fileName, 'a+', function (err, fd) {
                                if (err) {
                                    return console.error(err);
                                }

                                _fs2.default.close(fd, function (err) {
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
    }]);

    return Logger;
}();

exports.default = Logger;