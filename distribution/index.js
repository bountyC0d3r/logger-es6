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
        _classCallCheck(this, Logger);

        this.fileName = fileName;
    }

    _createClass(Logger, [{
        key: 'writeFile',
        value: function writeFile() {
            var fileName = this.fileName;

            _fs2.default.open(fileName, 'a+', function (err, fd) {
                if (err) {
                    return console.error(err);
                }
                console.log("File opened successfully!" + fileName);
                _fs2.default.writeFile(fileName, "Hey there!", function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });

                _fs2.default.close(fd, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("File closed successfully.");
                });
            });
        }
    }]);

    return Logger;
}();

exports.default = Logger;