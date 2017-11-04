
var fs = require('fs');
var WiFi = require('./wifi-connection.js');
var isString = require('yow/is').isString;
var Events  = require('events');
var child_process = require('child_process');
var FileMonitor = require('./file-monitor.js');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class WifiSetup extends Events {

    constructor(fileName) {
        super();

        this.fileName = fileName;
        this.monitor  = new FileMonitor(this.fileName);

        this.monitor.on('created', (file) => {
            debug('Wi-Fi file created. Setting up again.');

            this.emit('wifi-changed');
            this.setup();
        });

        this.monitor.on('changed', (file) => {
            debug('Wi-Fi file changed. Setting up again.');

            this.emit('wifi-changed');
            this.setup();
        });


        this.monitor.start();

    }



    setup() {
        var self = this;
        var fileName = this.fileName;

        debug('Setting up Wi-Fi using file', fileName);

        function enableBluetoothDiscovery(timeout) {

            function disable() {
                // Disable Bluetooth
                debug('Disabling Bluetooth...');

                child_process.exec('sudo hciconfig hci0 noscan', (error, stdout, stderr) => {
                });

            }

            function enable() {
                // Enable Bluetooth
                debug('Enabling Bluetooth...');

                child_process.exec('sudo hciconfig hci0 piscan', (error, stdout, stderr) => {
                    if (!error) {
                        if (timeout != undefined)
                            setTimeout(disable, timeout);
                    }
                });

            }

            enable();
        }


        function loadFile() {
            try {
                debug('Loading file', fileName);
                return JSON.parse(fs.readFileSync(fileName));
            }
            catch(error) {
            }
        }

        function deleteFile() {
            try {
                fs.unlinkSync(fileName);
            }
            catch(error) {
            }

        }

        var wifi = new WiFi();

        Promise.resolve().then(() => {
            return Promise.resolve(loadFile());
        })

        .then((config) => {
            if (config && isString(config.ssid)) {
                this.emit('connecting');

                return wifi.connectToNetwork(config.ssid, config.password, 30000).then(() => {
                    return true;
                })
                .catch((error) => {
                    return false;
                })
            }
            else {
                return wifi.getConnectionState();
            }
        })

        .then((connected) => {
            if (!connected) {
                throw new Error('No Wi-Fi connection.');
            }

            // Enable bluetooth discovery for 30 minutes
            enableBluetoothDiscovery(30 * 60 * 1000);

            this.emit('ready');

        })

        .catch((error) => {
            debug(error);

            // Enable bluetooth forever
            enableBluetoothDiscovery();

            self.emit('discoverable');
        })

        .then(() => {
            deleteFile();
        })

    }

}
