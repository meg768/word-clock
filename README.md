# Word Clock

Word Clock as of 2025-09-17.

## Setting up the Pi Zero
See https://github.com/meg768/installing-new-rpi-from-scratch. Use node version 14.21.3
to make pigpio build correctly.

### Install git and pigpio

````bash
sudo apt-get install -y git build-essential python3 pigpio
````

### Clone repository

````bash
git clone https://github.com/meg768/word-clock.git
````

### Run it

````bash
cd word-clock
npm install
sudo node ./word-clock.js clock
````



## Links
- Send files to RPI over Bluetooth - https://www.raspberrypi.org/forums/viewtopic.php?p=963751#p963751
- Powering lots of leds - http://www.eerkmans.nl/powering-lots-of-leds-from-arduino/
- Adafruit Neopixel Library - https://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library
- I2C Communication between Raspberry and Arduino - https://oscarliang.com/raspberry-pi-arduino-connected-i2c/
- Drawings of Raspberry Pi PCB - https://www.raspberrypi.org/documentation/hardware/raspberrypi/mechanical/README.md
- Upgrading node - http://thisdavej.com/upgrading-to-more-recent-versions-of-node-js-on-the-raspberry-pi/
- Installing node on Pi Zero - https://blog.miniarray.com/installing-node-js-on-a-raspberry-pi-zero-21a1522db2bb
- Installing later node versions on Pi Zero - https://github.com/sdesalas/node-pi-zero
- More I2C - https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial
- A nice clock - http://arduclock.de
