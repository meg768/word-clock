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
            
            if (index + length > count)
                length = count - index;

            RGB *strip = _strip.bytes();

            for (int i = 0; i < length; i++, strip++) {
                strip->red = red;
                strip->green = green;
                strip->blue = blue;                
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
        
        void show(int duration) {

            int length = numPixels();
            int offset = 0;
            

            RGB *rgb = _rgb.bytes();
            RGB *strip = _strip.bytes();

            for (int i = 0; i < length; i++) {
                uint32_t color = getPixelColor(i + offset);
                rgb[i].red   = (int)(uint8_t)(color >> 16);
                rgb[i].green = (int)(uint8_t)(color >> 8);
                rgb[i].blue  = (int)(uint8_t)(color);
            }
       

            // Calculate number of steps to be finished in specified time
            // Factors are computed by measuring a fixed number of iterations for different lengths

            float factorX = 0.273958333333333;
            float factorY = 1.033333333333333;
            float factorZ = 1.0;

            long numSteps = (long)((float)duration * factorZ / ((float)length * factorX + factorY));

            for (long step = 0; step <= numSteps; step++) {

                for (int i = 0; i < length; i++) {
                    int pixelRed   = (long)rgb[i].red   + (step * ((long)strip[i].red   - (long)rgb[i].red))   / numSteps;
                    int pixelGreen = (long)rgb[i].green + (step * ((long)strip[i].green - (long)rgb[i].green)) / numSteps;
                    int pixelBlue  = (long)rgb[i].blue  + (step * ((long)strip[i].blue  - (long)rgb[i].blue))  / numSteps;

                    setPixelColor(offset + i, pixelRed, pixelGreen, pixelBlue);
                }

                Adafruit_NeoPixel::show();
                

            }
                

        }

};
