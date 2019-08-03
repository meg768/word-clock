# Word Clock

Word Clock as of 2019-08-03.

## Setting up the Pi Zero

Visit https://www.raspberrypi.org/downloads to download latest version of Raspberry OS.
Use Pi-Filler or other tool to create an SD-card with the latest image.

### Enable SSH

Create an empty file named ssh and copy it to boot. From the Mac terminal
enter this.

````bash
echo > /Volumes/boot/ssh
````

### Create a Wifi Connection

Create a file named **wpa_supplicant.conf** in the **/Volumes/boot** folder.
It should contain something like this.

````bash
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=GB

network={
    ssid="my-wifi-name"
    psk="my-password"
}
````

This could be done by typing the following

````bash
nano /Volumes/boot/wpa_supplicant.conf
````

Then paste the contents above and save. Now eject
your drive named **boot** and put the SD card in the Pi. Hopefully you will
figure out the IP address of your Pi. Connect to it via SSH.

### Update Stuff

When all set up. Update apt-get.

````bash
sudo apt-get update && sudo apt-get dist-upgrade
````

### Raspberry Pi Configuration

Use **raspi-config** to set time zone, enable SSH and name your Pi.

````bash
sudo raspi-config
````

### Install Node and npm

````bash
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v11.5.0.sh | bash
````

See https://github.com/sdesalas/node-pi-zero for later versions.

### Install git and pigpio

````bash
sudo apt-get install git-core pigpio
````

### Clone repository

````bash
git clone https://github.com/meg768/word-clock.git
````

### Run it

````bash
cd word-clock
npm install
sudo node ./word-clock.js loop
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
