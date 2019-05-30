var debug = require('./debug.js');


module.exports = function(fn, timeout) { 

    var result = undefined;
    var force  = false;

    var loop = function() { 

        var myargs = arguments;

		return new Promise((resolve, reject) => {

			if (result == undefined || force) {
                debug(force ? 'Calling first time...' : 'Updating contents...')
				fn.apply(this, arguments).then((data) => {
                    result = data;
                    
                    setTimeout(() => {
                        force = true;
                        loop.apply(this, arguments).then((data) => {
                            debug('Done!');
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                        .then(() => {
                            force = false;
                        })

                    }, timeout);

					resolve(result);	
				})
				.catch((error) => {
					reject(error);
				})
			}
			else {
                debug('Returning cached result.');
				resolve(result);

            }
		
		});
    };

    return loop;
}

