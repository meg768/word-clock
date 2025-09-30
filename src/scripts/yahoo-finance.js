var yahooFinance = require('yahoo-finance2');


yahooFinance.setGlobalConfig({
	logger: {
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		log: () => {}
	}
});

module.exports = yahooFinance.default;
