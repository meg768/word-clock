var Neopixels = require('rpi-neopixels');

function configure() {

    function cleanup() {
        console.log('Cleaning up...');
        var pixels = new Neopixels.Pixels();

        pixels.fill('black');
        pixels.render();
        
        process.exit();
    }

    var stripType = 'grb';
    var width     = 13;
    var height    = 13;
    var map       = 'alternating-matrix';

    Neopixels.configure({debug:false, map:map, width:width, height:height, stripType:stripType});

    process.on('SIGUSR1', cleanup);
    process.on('SIGUSR2', cleanup);
    process.on('SIGINT',  cleanup);
    process.on('SIGTERM', cleanup);
    process.on('SIGALRM', cleanup);
    process.on('SIGHUP', cleanup);
    process.on('SIGQUIT', cleanup);
}


configure();

module.exports = Neopixels;