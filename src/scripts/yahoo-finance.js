// Notera .default när du använder require
const YahooFinance = require('yahoo-finance2').default;

// tyst logger
const silent = { debug() {}, info() {}, warn() {}, error() {}, log() {} };

// skapa en instans med egen logger
const yf = new YahooFinance({ logger: silent });

module.exports = yf;
