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

    process.once('SIGUSR1', cleanup);
    process.once('SIGUSR2', cleanup);
    process.once('SIGINT',  cleanup);
    process.once('SIGTERM', cleanup);
    process.once('SIGKILL', cleanup);
    process.once('SIGALRM', cleanup);
}


configure();

module.exports = Neopixels;