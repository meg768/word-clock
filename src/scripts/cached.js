var debug = require('./debug.js');


module.exports = function(fn, timeout) { 

    var result = undefined;

    var foo = function() { 

		return new Promise((resolve, reject) => {
			var now = new Date();

			if (result == undefined) {
                debug('Calling first time...')
				fn.apply(this, arguments).then((data) => {
                    result = data;
                    
                    setTimeout(() => {
                        debug('Updating contents now...');
                        foo.then((data) => {
                            debug('Done!');
                        })
                        .catch((error) => {
                            console.log(error);
                        });

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

    return foo;
}

