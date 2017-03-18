import fs from 'fs';

class Logger {
    constructor(fileName, ferq = 'd', size = 0) {
        this.fileName = fileName;

        if (ferq === 'd') {
            fs.stat('input.txt', function (err, stats) {
                if (err) {
                    return console.error(err);
                }
                console.log(stats);
                console.log("Got file info successfully!");

                // Check file type
                console.log("isFile ? " + stats.isFile());
                console.log("isDirectory ? " + stats.isDirectory());
            });



            fs.open(this.fileName, 'a+', function(err, fd) {
                if (err) {
                    return console.error(err);
                }

                fs.close(fd, function(err) {
                    if (err){
                        console.log(err);
                    }
                });
            });
        }
    }

    debug(debugString, debugData) {
        fs.appendFile(this.fileName, "DEBUG: " + debugString + " : " + debugData + '\r\n', function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }

    info(infoString) {
        fs.appendFile(this.fileName, "INFO: " + infoString  + '\r\n', function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }
}

export default Logger;

