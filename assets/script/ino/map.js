// Block map
const map = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Basic",
      colour: "#0091ff",
      contents: [
        {
          kind: "block",
          type: "definePin",
        },
        {
          kind: "block",
          type: "definePinToVar",
        },
        {
          kind: "block",
          type: "defineLed",
        },
        {
          kind: "block",
          type: "playSpkr",
        },
        {
          kind: "block",
          type: "stopSpkr",
        },
        {
          kind: "block",
          type: "serialPrnt",
        },
        {
          kind: "block",
          type: "pinMode",
        },
        {
          kind: "block",
          type: "serialBegin",
        },
      ],
    },
    {
      kind: "category",
      name: "Events",
      colour: "#ffdd00",
      contents: [
        {
          kind: "block",
          type: "onStart",
        },
        {
          kind: "block",
          type: "forever",
        },
        {
          kind: "block",
          type: "headerEvent",
        },
      ],
    },
    {
      kind: "category",
      name: "Control",
      colour: "#ffa600",
      contents: [
        {
          kind: "block",
          type: "wait",
        },
        {
          kind: "block",
          type: "repeat",
        },
        {
          kind: "block",
          type: "repeatwhile",
        },
        {
          kind: "block",
          type: "controls_if",
        },
      ],
    },
    {
      kind: "category",
      name: "Operators And Math",
      colour: "#2bff00",
      contents: [
        { kind: "block", type: "math_number" },
        { kind: "block", type: "text" },
        { kind: "block", type: "math_arithmetic" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "math_random_int" },
        { kind: "block", type: "logic_operation" },
        { kind: "block", type: "logic_negate" },
        { kind: "block", type: "math_single" },
        {
          kind: "block",
          type: "math_map_range",
        },
        //math_constrain_range
        {
          kind: "block",
          type: "math_constrain_range",
        },
      ],
    },
    {
      kind: "category",
      name: "Input",
      colour: "#d000ff",
      contents: [
        {
          kind: "block",
          type: "readdigital",
        },
        {
          kind: "block",
          type: "readanalog",
        },
        {
          kind: "block",
          type: "serialnum",
        },
        {
          kind: "block",
          type: "serialread",
        },
        {
          kind: "block",
          type: "tempread",
        },
        {
          kind: "block",
          type: "infaread",
        },
      ],
    },
    {
      kind: "category",
      name: "Wire",
      colour: "#ff0000",
      contents: [
        {
          kind: "category",
          name: "LCD",
          colour: "#ff0000",
          contents: [
            {
              kind: "block",
              type: "initLcd",
            },
            {
              kind: "block",
              type: "lcdI2cClear",
            },
            {
              kind: "block",
              type: "lcdI2cSetCursor",
            },
            {
              kind: "block",
              type: "lcdI2cPrint",
            },
          ],
        },
        {
          kind: "block",
          type: "includeWire",
        },
      ],
    },
    {
      kind: "category",
      name: "LiquidCrystal",
      colour: "#00ff66",
      contents: [
        {
          kind: "block",
          type: "includeLiquidCrystal",
        },
        {
          kind: "block",
          type: "newLcd4Screen",
        },
        {
          kind: "block",
          type: "newLcd8Screen",
        },
      ],
    },
    {
      kind: "category",
      name: "LiquidCrystal_I2C",
      colour: "#00ff11",
      contents: [
        {
          kind: "block",
          type: "includeLiquidCrystalI2C",
        },
        {
          kind: "block",
          type: "newI2cScreen",
        },
        {
          kind: "block",
          type: "initI2cScreen",
        },
      ],
    },
    {
      kind: "category",
      name: "Adafruit_LiquidCrystal",
      colour: "#00b834",
      contents: [
        {
          kind: "block",
          type: "includeAdafruitLCD"
        },
        {
          kind: "block",
          type: "newAdafruitLcdScreen"
        },
        {
          kind: "block",
          type: "initAdafruitLcdScreen"
        }
      ]
    },
    {
        kind: "category",
        name: "Servo",
        colour: "#000dff",
        contents: [
            {
                kind: "block",
                type: "includeServo"
            },
            {
                kind: "block",
                type: "newServo"
            },
            {
                kind: "block",
                type: "attachServo"
            },
            {
                kind: "block",
                type: "writeServo"
            },
            {
                kind: "block",
                type: "writeMicrosecondsServo"
            },
            {
                kind: "block",
                type: "readServo"
            },
            {
                kind: "block",
                type: "detachServo"
            }
        ]
    },
    {
        kind: "category",
        name: "Adafruit_NeoPixel",
        colour: "#e040fb",
        contents: [
            {
                kind: "block",
                type: "includeNeoPixel"
            },
            {
                kind: "block",
                type: "newNeoPixel"
            },
            {
                kind: "block",
                type: "initNeoPixel"
            },
            {
                kind: "block",
                type: "setNeoPixelColor"
            },
            {
                kind: "block",
                type: "showNeoPixel"
            },
            {
                kind: "block",
                type: "clearNeoPixel"
            },
            {
                kind: "block",
                type: "setBrightnessNeoPixel"
            },
            {
                kind: "block",
                type: "numPixelsNeoPixel"
            },
            {
                kind: "block",
                type: "getPixelColorNeoPixel"
            }
        ]        
    },
    {
      kind: "category",
      name: "Adafruit_Sensor",
      colour: "#0062ff",
      contents: [
        {
          kind: "block",
          type: "includeAdafruitSensor"
        }
      ]
    },
    {
      kind: "category",
      name: "DHT",
      colour: "#009688",
      contents: [
        {
          kind: "block",
          type: "includeDHT"
        },
        {
          kind: "block",
          type: "newDhtSensor"
        },
        {
          kind: "block",
          type: "initDhtSensor"
        },
        {
          kind: "block",
          type: "readDhtTemperature"
        },
        {
          kind: "block",
          type: "readDhtHumidity"
        }
      ]
    },
    {
      kind: "category",
      name: "HCSR04",
      colour: "#00bcd4",
      contents: [
        {
          kind: "block",
          type: "includeUltrasonic"
        },
        {
          kind: "block",
          type: "newUltrasonicSensor"
        },
        {
          kind: "block",
          type: "readUltrasonicDistance"
        }
      ]
    },
    {
      kind: "category",
      name: "SoftwareSerial",
      colour: "#37474f",
      contents: [
        {
          kind: "block",
          type: "includeSoftwareSerial"
        },
        {
          kind: "block",
          type: "newSoftwareSerial"
        },
        {
          kind: "block",
          type: "beginSoftwareSerial"
        },
        {
          kind: "block",
          type: "printSoftwareSerial"
        },
        {
          kind: "block",
          type: "availableSoftwareSerial"
        },
        {
          kind: "block",
          type: "readSoftwareSerial"
        }
      ]
    },
    {
      kind: "category",
      name: "OLED SSD1306",
      colour: "#3f51b5",
      contents: [
        {
          kind: "block",
          type: "includeSSD1306"
        },
        {
          kind: "block",
          type: "newSSD1306Screen"
        },
        {
          kind: "block",
          type: "initSSD1306Screen"
        },
        {
          kind: "block",
          type: "clearSSD1306"
        },
        {
          kind: "block",
          type: "setTextFormatSSD1306"
        },
        {
          kind: "block",
          type: "printSSD1306"
        },
        {
          kind: "block",
          type: "showSSD1306"
        }
      ]
    },
    {
      kind: "category",
      name: "Adafruit_GFX (Draw)",
      colour: "#1a237e",
      contents: [
        {
          kind: "block",
          type: "includeAdafruitGFX"
        },
        {
          kind: "block",
          type: "gfxDrawLine"
        },
        {
          kind: "block",
          type: "gfxDrawRect"
        },
        {
          kind: "block",
          type: "gfxDrawCircle"
        },
        {
          kind: "block",
          type: "gfxDrawRoundRect"
        }
      ]
    },
    {
      kind: "category",
      name: "Constants",
      colour: "#9c27b0",
      contents: [
        {
          kind: "block",
          type: "createDefineConstant"
        },
        {
          kind: "block",
          type: "getDefineConstant"
        }
      ]
    },
    {
      kind: "category",
      name: "Variables",
      colour: "#a600ff",
      contents: [
        {
          kind: "block",
          type: "declareGlobalVar"
        },
        {
          kind: "block",
          type: "setGlobalVar"
        },
        {
          kind: "block",
          type: "getGlobalVar"
        }
      ]
    },
    {
      kind: "category",
      name: "Functions",
      colour: "#009688",
      contents: [
        {
          kind: "block",
          type: "defineVoidFunc"
        },
        {
          kind: "block",
          type: "callVoidFunc"
        },
        {
          kind: "block",
          type: "defineValueFunc"
        },
        {
          kind: "block",
          type: "callValueFunc"
        }
      ]
    },
    {
      kind: "category",
      name: "Comments",
      colour: "#757575",
      contents: [
        {
          kind: "block",
          type: "arduinoComment"
        }
      ]
    }
  ],
};
