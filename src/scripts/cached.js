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

    var clearTimer = function() {
        if (timer)
            clearTimeout(timer);
        
        timer = undefined;
    }

    var setTimer = function(fn) {
        clearTimer();

        timer = setTimeout(fn, timeout);
    }

    var loop = function() { 

		return new Promise((resolve, reject) => {

			if (cache == undefined || forceRequest) {
                // Never been called before or new request is required...
                debug(forceRequest ? 'Updating contents...' : 'Calling first time...');

                // Make sure to forget previous calls
                // This must be done before we apply the function, since it may take some time to resolve
                clearTimer();

                // Make the call
                var promise = fn.apply(this, arguments);
                
                // Make sure the function returns a promise
                if (!(promise instanceof Promise)) {
                    throw new Error('Function must return a promise.');
                }

				promise.then((data) => {
                    debug('Storing data to cache.');
                    cache = data;
                    
                    setTimer(() => {
                        
                        // Make sure we make a real request
                        forceRequest = true;

                        loop.apply(this, arguments).then((data) => {
                            debug('Done!');
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                        .then(() => {
                            // Reset timer, if any
                            clearTimer();

                            forceRequest = false;
                        })

                    });

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

