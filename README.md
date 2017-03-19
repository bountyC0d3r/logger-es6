# node-logger-es6
A simple yet powerful async logging library for node.js + ES6

## Installation
```
npm install node-logger-es6
```

## Usage
- [Configure](#configure)
- [Start Logging](#start-logging)


### Configure
- Properties
    -  level: Define the 'Level' of log, i.e. INFO/DEBUG/VERBOSE; default value `INFO`
    - rotation: Logfile rotation, i.e. d = Daily, w = Weekly; Default value `d`
    - size: Max size of 1 logfile in MB; default value `5 MB`
    -  json: Create log in JSON format; default value `true`,
     - timestamp: Include timestamp with each log line; default value `true`
```$xslt
let logger = Logger.configure(
    {
        level: 'debug',
        rotation: 'd',
        size: 5,
        json: true,
        timestamp: true
    }
);
```

###Start Logging
- logger.info("This is info message ");
- logger.debug("Log Message", "Log Details");
- logger.error("Error Message", "Error Details");


