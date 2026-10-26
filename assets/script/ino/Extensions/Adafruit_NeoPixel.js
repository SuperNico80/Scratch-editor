// 1. Incluir la librería (Para el Header)
newBlock(
  "includeNeoPixel",
  "Include this library",
  [],
  "#e040fb", // Color magenta/morado brillante para NeoPixels
  "This block includes this library to your sketch.",
  ""
);

// 2. Configurar la tira de LEDs (Para el Header)
newBlock(
  "newNeoPixel",
  "Configure NeoPixel strip named %1 with %2 LEDs on pin %3",
  [
    { "type": "input_value", "name": "stripname" },
    { "type": "input_value", "name": "numleds" },
    {
      "type": "field_dropdown",
      "name": "pin",
      "options": [
        ["0", "P0"], ["1", "P1"], ["2", "P2"], ["3", "P3"], ["4", "P4"],
        ["5", "P5"], ["6", "P6"], ["7", "P7"], ["8", "P8"], ["9", "P9"],
        ["10", "P10"], ["11", "P11"], ["12", "P12"], ["13", "P13"]
      ]
    }
  ],
  "#e040fb",
  "Defines a new global NeoPixel strip with number of LEDs and its data pin.",
  ""
);

// 3. Inicializar la tira (Para On start)
newBlock(
  "initNeoPixel",
  "Initialize NeoPixel strip %1",
  [
    { "type": "input_value", "name": "stripname" }
  ],
  "#e040fb",
  "Starts communication with the NeoPixel strip in the setup.",
  ""
);

// 4. Asignar color a un LED específico (Para forever)
newBlock(
  "setNeoPixelColor",
  "On NeoPixel strip %1 set LED number %2 to color %3",
  [
    { "type": "input_value", "name": "stripname" },
    { "type": "input_value", "name": "ledindex" },
    { "type": "field_colour", "name": "color", "colour": "#ff0000" } // Selector de color visual
  ],
  "#e040fb",
  "Sets the RGB color of a specific LED index (starts at 0).",
  ""
);

// 5. Enviar los colores a la tira física (Para forever)
newBlock(
  "showNeoPixel",
  "Update NeoPixel strip %1 changes",
  [
    { "type": "input_value", "name": "stripname" }
  ],
  "#e040fb",
  "Pushes the colored pixel configurations to the actual physical strip.",
  ""
);
// 1. Comando para borrar/apagar todos los LEDs (pixels.clear())
newBlock(
  "clearNeoPixel",
  "Clear/Turn off all LEDs on NeoPixel strip %1",
  [
    { "type": "input_value", "name": "stripname" }
  ],
  "#e040fb",
  "Sets all pixel colors on the strip to off (0, 0, 0).",
  ""
);

// 2. Comando para ajustar el brillo global (pixels.setBrightness())
newBlock(
  "setBrightnessNeoPixel",
  "On NeoPixel strip %1 set global brightness to %2 (0-255)",
  [
    { "type": "input_value", "name": "stripname" },
    { "type": "input_value", "name": "brightness" }
  ],
  "#e040fb",
  "Adjusts the overall brightness intensity of the entire LED strip.",
  ""
);

// 3. Bloque Reportero: Obtener cantidad de LEDs (pixels.numPixels())
newBlock(
  "numPixelsNeoPixel",
  "Total number of LEDs on strip %1",
  [
    { "type": "input_value", "name": "stripname" }
  ],
  "#e040fb",
  "Returns the total number of pixels configured in this strip.",
  "",
  true, // useEvent = false
  true   // useVarReporter = true (Retorna un Número)
);

// 4. Bloque Reportero: Leer color de un LED (pixels.getPixelColor())
newBlock(
  "getPixelColorNeoPixel",
  "On strip %1 read color of LED number %2",
  [
    { "type": "input_value", "name": "stripname" },
    { "type": "input_value", "name": "ledindex" }
  ],
  "#e040fb",
  "Returns the current color value of a specific LED index.",
  "",
  true,
  true   // useVarReporter = true (Retorna un Número de color empaquetado)
);