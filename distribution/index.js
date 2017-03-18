'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
    function Logger(fileName) {
        var ferq = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'd';
        var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, Logger);

        this.fileName = fileName;

        if (ferq === 'd') {
            _fs2.default.stat('input.txt', function (err, stats) {
                if (err) {
                    return console.error(err);
                }
                console.log(stats);
                console.log("Got file info successfully!");

                // Check file type
                console.log("isFile ? " + stats.isFile());
                console.log("isDirectory ? " + stats.isDirectory());
            });

            _fs2.default.open(this.fileName, 'a+', function (err, fd) {
                if (err) {
                    return console.error(err);
                }

                _fs2.default.close(fd, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
    }

    _createClass(Logger, [{
        key: 'debug',
        value: function debug(debugString, debugData) {
            _fs2.default.appendFile(this.fileName, "DEBUG: " + debugString + " : " + debugData + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }, {
        key: 'info',
        value: function info(infoString) {
            _fs2.default.appendFile(this.fileName, "INFO: " + infoString + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }]);

    return Logger;
}();

exports.default = Logger;