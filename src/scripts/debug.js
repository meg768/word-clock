var sprintf = require('yow/sprintf');

module.exports = function debug() {

	var date  = new Date();
	var args = Array.prototype.slice.call(arguments);

	args = args.unshift(sprintf('%04d-%02d-%02d %02d:%02d.%02d: ', date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

    console.log.apply(this, args);
}
