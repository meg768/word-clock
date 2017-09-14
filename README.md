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

## Texts to display

### Time
- FEM/TIO/KVART/TJUGO/LITE
- I/ÖVER
- HALV
- ETT/TVÅ/TRE/FYRA/FEM/SEX/SJU/ÅTTA/NIO/TIO
- MÅ/TI/ON/TO/FR/LÖ/SÖ


### Weather
- REGN
- SNÖ
- SOL
- MOLN
- VIND

### Stock Index
- OMX
- NASDAQ
- DAX
- DOWJONES
- HANGSENG
- USA
- UK
- BRIC
- NIKKEI

### Currency
- EUR
- USD
- GBP
- CAD
- NOK
- DKK
- JPY

## Links
- Powering lots of leds - http://www.eerkmans.nl/powering-lots-of-leds-from-arduino/
- Adafruit Neopixel Library - https://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library
- I2C Communication between Raspberry and Arduino - https://oscarliang.com/raspberry-pi-arduino-connected-i2c/
- Drawings of Raspberry Pi PCB - https://www.raspberrypi.org/documentation/hardware/raspberrypi/mechanical/README.md


### More links
- http://thisdavej.com/upgrading-to-more-recent-versions-of-node-js-on-the-raspberry-pi/
- https://blog.miniarray.com/installing-node-js-on-a-raspberry-pi-zero-21a1522db2bb
- https://github.com/sdesalas/node-pi-zero
- https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial
- http://arduclock.de
