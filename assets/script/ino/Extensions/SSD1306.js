// 1. Incluir las librerías necesarias (Para el Header)
newBlock(
  "includeSSD1306",
  "Include this library",
  [],
  "#3f51b5", // Color azul índigo elegante para pantallas gráficas
  "This block includes this library to your sketch.",
  ""
);

// 2. Configurar la pantalla OLED globalmente (Para el Header)
newBlock(
  "newSSD1306Screen",
  "Configure OLED named %1 width %2 height %3 address %4",
  [
    { "type": "input_value", "name": "displayname" },
    { "type": "input_value", "name": "width" },
    { "type": "input_value", "name": "height" },
    {
      "type": "field_dropdown",
      "name": "address",
      "options": [
        ["0x3C (Standard)", "0x3C"],
        ["0x3D", "0x3D"]
      ]
    }
  ],
  "#3f51b5",
  "Defines a new global Adafruit SSD1306 OLED screen object.",
  ""
);

// 3. Inicializar la pantalla en el arranque (Para On start)
newBlock(
  "initSSD1306Screen",
  "Initialize OLED %1",
  [
    { "type": "input_value", "name": "displayname" }
  ],
  "#3f51b5",
  "Initializes the OLED display inside setup.",
  ""
);

// 4. Limpiar la pantalla / Borrar búfer (Para forever)
newBlock(
  "clearSSD1306",
  "Clear OLED screen %1",
  [
    { "type": "input_value", "name": "displayname" }
  ],
  "#3f51b5",
  "Clears the display buffer (turns off all pixels).",
  ""
);

// 5. Configurar el formato del texto: posición, tamaño y color (Para forever)
newBlock(
  "setTextFormatSSD1306",
  "On OLED %1 set text cursor x %2 y %3 size %4",
  [
    { "type": "input_value", "name": "displayname" },
    { "type": "input_value", "name": "x" },
    { "type": "input_value", "name": "y" },
    { "type": "input_value", "name": "size" }
  ],
  "#3f51b5",
  "Sets the cursor position and font size for drawing text.",
  ""
);

// 6. Escribir texto en el búfer (Para forever)
newBlock(
  "printSSD1306",
  "On OLED %1 print %2",
  [
    { "type": "input_value", "name": "displayname" },
    { "type": "input_value", "name": "value" }
  ],
  "#3f51b5",
  "Writes text or numbers to the internal screen buffer.",
  ""
);

// 7. Renderizar/Mostrar cambios físicos (Para forever)
newBlock(
  "showSSD1306",
  "Update OLED %1 changes",
  [
    { "type": "input_value", "name": "displayname" }
  ],
  "#3f51b5",
  "Pushes the internal buffer data onto the physical OLED screen.",
  ""
);