# Word Clock

Word Clock


## Setting up the Pi Zero

Update apt-get

````bash
sudo apt-get update && sudo apt-get dist-upgrade
````

Install Node and npm

````bash
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v6.9.1.sh | bash
````

Use raspi-config to set time zone, enable SSH and SPI.

````bash
sudo raspi-config
````


## Links
http://thisdavej.com/upgrading-to-more-recent-versions-of-node-js-on-the-raspberry-pi/
https://blog.miniarray.com/installing-node-js-on-a-raspberry-pi-zero-21a1522db2bb
https://github.com/sdesalas/node-pi-zero
https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial
http://arduclock.de
https://www.raspberrypi.org/documentation/hardware/raspberrypi/mechanical/README.md
https://oscarliang.com/raspberry-pi-arduino-connected-i2c/
