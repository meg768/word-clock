// yahoo-finance.js (CommonJS / Node 16-vänligt)
const yahooFinance = require('yahoo-finance2').default;

const silent = { debug() {}, info() {}, warn() {}, error() {}, log() {} };

// Tysta all loggning i v2:
yahooFinance.setGlobalConfig({ logger: silent });

module.exports = yahooFinance;
