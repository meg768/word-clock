#ifdef __AVR__
#include <avr/power.h>
#endif

// IMPORTANT: To reduce NeoPixel burnout risk, add 1000 uF capacitor across
// pixel power leads, add 300 - 500 Ohm resistor on first pixel's data input
// and minimize distance between Arduino and first pixel.  Avoid connecting
// on a live circuit...if you must, connect GND first.

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)


#include <Adafruit_NeoPixel.h>
#include "memory.h"


class NeopixelStrip : public Adafruit_NeoPixel {

    private:
        typedef struct RGB {
            uint8_t red;
            uint8_t green;
            uint8_t blue;
        };

        // Buffer to hold pixel colors during fading
        Memory _rgb;
        Memory _strip;

    public:

        NeopixelStrip(int length, int pin, int type = NEO_GRB + NEO_KHZ800) : Adafruit_NeoPixel(length, pin, type) {
            _rgb.alloc(length * sizeof(RGB));
            _strip.alloc(length * sizeof(RGB));
        };


        virtual ~NeopixelStrip() {
        };


        void colorize(int index, int length, int red, int green, int blue) {

            int count = numPixels();

            if (index < 0)
                index = 0;

            if (index >= count)
                index = count - 1;
                
            if (index + length > count)
                length = count - index;

            RGB *strip = _strip.bytes();
            RGB *pixel = strip + index;
            
            for (int i = 0; i < length; i++, pixel++) {
                pixel->red = red;
                pixel->green = green;
                pixel->blue = blue;                
            }
        }
        
        void colorize(int red, int green, int blue) {
            colorize(0, numPixels(), red, green, blue);    
        }

        void updateLength(int length) {
            Adafruit_NeoPixel::updateLength(length);

            // Set new size of color buffer
            _rgb.alloc(length * sizeof(RGB));

            // Set new size of color buffer
            _strip.alloc(length * sizeof(RGB));
       
        }
        
        void show(int numSteps) {

            int length = numPixels();

            if (1) {
                RGB *rgb = _rgb.bytes();
                
                for (int i = 0; i < length; i++, rgb++) {
                    uint32_t color = getPixelColor(i);
                    rgb->red   = (uint8_t)(color >> 16);
                    rgb->green = (uint8_t)(color >> 8);
                    rgb->blue  = (uint8_t)(color);
                }
            }

            if (numSteps > 0) {
                for (int32_t step = 0; step < numSteps; step++) {
    
                    RGB *rgb = _rgb.bytes();
                    RGB *strip = _strip.bytes();
    
                    for (int i = 0; i < length; i++, rgb++, strip++) {
                        int32_t pixelRed   = ((int32_t)rgb->red   + (step * ((int32_t)strip->red   - (int32_t)rgb->red))   / numSteps);
                        int32_t pixelGreen = ((int32_t)rgb->green + (step * ((int32_t)strip->green - (int32_t)rgb->green)) / numSteps);
                        int32_t pixelBlue  = ((int32_t)rgb->blue  + (step * ((int32_t)strip->blue  - (int32_t)rgb->blue))  / numSteps);
    
                        setPixelColor(i, pixelRed, pixelGreen, pixelBlue);
                    }
    
                    Adafruit_NeoPixel::show();
                }
            }

            if (1) {
                RGB *strip = _strip.bytes();

                for (int i = 0; i < length; i++, strip++) {
                    setPixelColor(i, strip->red, strip->green, strip->blue);
                }

                Adafruit_NeoPixel::show();
            }

        }

};

