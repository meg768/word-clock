
var fs            = require('fs');
var isString      = require('yow/is').isString;
var Events        = require('events');
var child_process = require('child_process');
var Watch         = require('watch');

function debug() {
    console.log.apply(this, arguments);
}


class FileMonitor extends Events {

	constructor(fileName) {
		super();

        this.fileName = fileName;
        this.monitor  = undefined;

	}

    start() {

        this.stop();

        debug('File monotoring enabled on file', this.fileName);

		var path = Path.dirname(this.fileName);

		Watch.createMonitor(path, (monitor) => {

            this.monitor = monitor;

			monitor.on('created', (file, stat) => {
				this.emit('created', file, stat);
			});

			monitor.on('changed', (file, stat) => {
				this.emit('changed', file, stat);
			});

			monitor.on('removed', (file, stat) => {
				this.emit('removed', file, stat);
			});


		});

	}

    stop() {
        if (this.monitor != undefined) {
            debug('Stopping file monotoring on file', this.fileName);

            this.monitor.stop();
            this.monitor = undefined;
        }
    }


};


class WiFiConnection {

    constructor(iface = 'wlan0') {
        this.iface = iface;
    }


    wpa_cli(command, pattern) {

        return new Promise((resolve, reject) => {

            child_process.exec(sprintf('wpa_cli -i %s %s', this.iface, command), (error, stdout, stderr) => {
                if (error)
                    reject(error);
                else {
                    var output = stdout.trim();

                    if (pattern) {
                        var match = output.match(pattern);

                        if (match) {
                            if (match[1])
                                resolve(match[1]);
                            else
                                resolve();
                        }
                        else
                            reject(new Error(sprintf('Could not parse reply from wpa_cli: "%s"', output)));

                    }
                    else {
                        resolve(output);
                    }
                }
            });
        });
    }

    addNetwork() {
        debug('Adding network...');
        return this.wpa_cli('add_network', '^([0-9]+)');
    }

    selectNetwork(id) {
        debug(sprintf('Selecting network %d...', id));
        return this.wpa_cli(sprintf('select_network %s', id), '^OK');
    }

    saveConfiguration() {
        debug(sprintf('Saving configuration'));
        return this.wpa_cli(sprintf('save_config'), '^OK');

    }

    getConnectionState() {
        return new Promise((resolve, reject) => {

            this.getNetworkStatus().then((status) => {
                resolve(isString(status.ip_address));
            })

            .catch((error) => {
                reject(error);
            })
        });

    }

    delay(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }


    waitForNetworkConnection(timeout, timestamp) {

        if (timestamp == undefined)
            timestamp = new Date();

        return new Promise((resolve, reject) => {

            this.getConnectionState().then((connected) => {

                if (connected) {
                    return Promise.resolve();
                }
                else {
                    var now = new Date();

                    if (now.getTime() - timestamp.getTime() < timeout) {
                        return this.delay(1000).then(() => {
                            return this.waitForNetworkConnection(timeout, timestamp);
                        })
                    }
                    else
                        throw new Error('Unable to connect to network.');
                }
            })

            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    setNetworkVariable(id, name, value) {
        debug(sprintf('Setting variable %s=%s for network %d.', name, value, id));
        return this.wpa_cli(sprintf('set_network %d %s \'"%s"\'', id, name, value), '^OK');
    }

    removeAllNetworks() {
        debug('Removing all networks...');

        return new Promise((resolve, reject) => {
            this.getNetworks().then((networks) => {
                var promise = Promise.resolve();

                networks.forEach((network) => {
                    promise = promise.then(() => {
                        return this.removeNetwork(network.id);
                    });
                });

                promise.then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
            });
        });

    }

    removeNetwork(id) {
        this.wpa_cli(sprintf('remove_network %d', id), '^OK');
    }

    getNetworkStatus() {
        return new Promise((resolve, reject) => {

            this.wpa_cli('status').then((output) => {

                var match;
                var status = {};

                if ((match = output.match(/[^b]ssid=([^\n]+)/))) {
                    status.ssid = match[1];
                }

                if ((match = output.match(/ip_address=([^\n]+)/))) {
                    status.ip_address = match[1];
                }

                resolve(status);
            })
            .catch((error) => {
                reject(error);
            })
        });

    }

    getNetworks() {
        return new Promise((resolve, reject) => {

            this.wpa_cli('list_networks').then((output) => {

                output = output.split('\n');

                // Remove header
                output.splice(0, 1);

                var networks = [];

                output.forEach((line) => {
                    var params = line.split('\t');
                    networks.push({
                        id   : parseInt(params[0]),
                        ssid : params[1]
                    });

                });

                resolve(networks);
            })
            .catch((error) => {
                reject(error);
            })
        });

    }


    connectToNetwork(ssid, password, timeout = 20000) {
        return new Promise((resolve, reject) => {

            var networkID = undefined;

            this.removeAllNetworks().then(() => {
                return this.addNetwork();
            })
            .then((id) => {
                debug('Network created:', id);
                networkID = parseInt(id);
                return Promise.resolve();
            })
            .then(() => {
                return this.setNetworkVariable(networkID, 'ssid', ssid);
            })
            .then(() => {
                return (isString(password) ? this.setNetworkVariable(networkID, 'psk', password) : Promise.resolve());
            })
            .then(() => {
                return this.selectNetwork(networkID);
            })

            .then(() => {
                return this.waitForNetworkConnection(timeout);
            })

            .then(() => {
                return this.saveConfiguration();
            })

            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            })
        });

    }
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

        var wifi = new WiFiConnection();

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
