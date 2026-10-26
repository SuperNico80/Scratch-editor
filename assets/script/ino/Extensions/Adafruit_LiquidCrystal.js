// 1. Incluir la librería Adafruit_LiquidCrystal (Para el Header)
newBlock(
  "includeAdafruitLCD",
  "Include this library",
  [],
  "#00b834", // Tono celeste oscuro/cian para diferenciar la variante de Adafruit
  "his block includes this library to your sketch.",
  ""
);

// 2. Configurar la pantalla Adafruit LCD con dirección (Para el Header)
newBlock(
  "newAdafruitLcdScreen",
  "Configure Adafruit LCD screen with direction: %1 name: %2 cols: %3 rows: %4",
  [
    {
      "type": "field_dropdown",
      "name": "address",
      "options": [
        ["0 (Standard)", "0"],
        ["1", "1"],
        ["2", "2"]
      ]
    },
    { "type": "input_value", "name": "lcdname" },
    { "type": "input_value", "name": "cols" },
    { "type": "input_value", "name": "rows" }
  ],
  "#00b834",
  "Defines a new global Adafruit LiquidCrystal screen over an i2c backpack.",
  ""
);

// 3. Inicializar la pantalla Adafruit LCD (Para On start)
newBlock(
  "initAdafruitLcdScreen",
  "Initialize Adafruit LCD %1",
  [
    { "type": "input_value", "name": "lcdname" }
  ],
  "#00b834",
  "Starts communication parameters for the Adafruit LCD display inside setup.",
  ""
);