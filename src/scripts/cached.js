var debug = require('./debug.js');


module.exports = function() { 

    var cache        = undefined;
    var forceRequest = false;
    var fn           = undefined;
    var timeout      = undefined;
    var timer        = undefined;

    // Check arguments
    if (typeof arguments[0] == 'function' && typeof arguments[1] == 'number') {
        fn = arguments[0];
        timeout = arguments[1];
    }
    else if (typeof arguments[0] == 'number' && typeof arguments[1] == 'function') {
        timeout = arguments[0];
        fn = arguments[1];
    }
    else
        throw new Error('Invalid arguments for cached()');

    var loop = function() { 

		return new Promise((resolve, reject) => {

			if (cache == undefined || forceRequest) {
                debug(forceRequest ? 'Updating contents...' : 'Calling first time...');

				fn.apply(this, arguments).then((data) => {
                    debug('Storing data to cache.');
                    cache = data;
                    
                    if (timer)
                        clearTimeout(timer);

                    timer = setTimeout(() => {
                        
                        // Make sure we make a real request
                        forceRequest = true;

                        loop.apply(this, arguments).then((data) => {
                            debug('Done!');
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                        .then(() => {
                            forceRequest = false;
                        })

                    }, timeout);

					resolve(cache);	
				})
				.catch((error) => {
					reject(error);
				})
			}
			else {
                debug('Returning cached result.');
				resolve(cache);

            }
		
		});
    };

    return loop;
}

