var sprintf = require('yow/sprintf');
var debugMode = process.env.DEBUG == undefined ? false : parseInt(process.env.DEBUG) != 0;

function debugPrint() {
	var date = new Date();
	var args = Array.prototype.slice.call(arguments);

	args.unshift(sprintf('%04d-%02d-%02d %02d:%02d.%02d:', date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

	console.log.apply(this, args);
}

function debugNoop() {

}

if (debugMode) {
	module.exports = debugPrint;		
}
else {
	module.exports = debugNoop;
}
/*
module.exports = function () {
		return debugPrint;
	if (debugMode) {
		return debugPrint;
	}
	else {
		return debugNoop;
	}
};
*/