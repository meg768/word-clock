# Word Clock

Word Clock


## Setting up the Pi Zero

Update apt-get
    $ sudo apt-get update && sudo apt-get dist-upgrade

Install Node and npm
    $ wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v6.9.1.sh | bash

Use raspi-config
    $ sudo raspi-config

Make sure to set time zone, enable SSH and SPI.

## Links
http://thisdavej.com/upgrading-to-more-recent-versions-of-node-js-on-the-raspberry-pi/
https://blog.miniarray.com/installing-node-js-on-a-raspberry-pi-zero-21a1522db2bb
https://github.com/sdesalas/node-pi-zero
https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial
http://arduclock.de
