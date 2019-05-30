var debug = require('./debug.js');


module.exports = function() { 

    var result = undefined;
    var force  = false;
    var fn = undefined;
    var timeout = undefined;

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

        var myargs = arguments;

		return new Promise((resolve, reject) => {

			if (result == undefined || force) {
                debug(!force ? 'Calling first time...' : 'Updating contents...')
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

