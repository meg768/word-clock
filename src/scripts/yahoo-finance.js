const yahooFinance = require('yahoo-finance2').default;

// Quiet logger 
const silent = { debug() {}, info() {}, warn() {}, error() {}, log() {} };

// Set global config for all requests
yahooFinance.setGlobalConfig({ logger: silent });

module.exports = yahooFinance;
