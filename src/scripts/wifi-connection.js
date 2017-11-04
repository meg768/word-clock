

var sprintf = require('yow/sprintf');
var isString = require('yow/is').isString;
var child_process = require('child_process');


function debug() {
    console.log.apply(this, arguments);
}

module.exports = class WiFi {

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
