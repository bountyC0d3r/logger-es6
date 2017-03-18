import fs from 'fs';

class Logger {
    constructor(fileName ) {
        this.fileName = fileName;
    }

    writeFile() {
        let fileName = this.fileName;

        fs.open(fileName, 'a+', function(err, fd) {
            if (err) {
                return console.error(err);
            }
            console.log("File opened successfully!" + fileName);
            fs.writeFile(fileName, "Hey there!", function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });

            fs.close(fd, function(err){
                if (err){
                    console.log(err);
                }
                console.log("File closed successfully.");
            });
        });
    }
}

export default Logger;

