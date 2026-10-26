// 1. Incluir la librería SoftwareSerial (Para el Header)
newBlock(
  "includeSoftwareSerial",
  "Include this library",
  [],
  "#37474f", // Color gris oscuro metalizado para comunicación de bajo nivel
  "This block includes this library to your sketch.",
  ""
);

// 2. Configurar el puerto serie virtual (Para el Header)
newBlock(
  "newSoftwareSerial",
  "Configure SoftwareSerial named %1 with RX pin %2 TX pin %3",
  [
    { "type": "input_value", "name": "serialname" },
    {
      "type": "field_dropdown",
      "name": "rx",
      "options": [
        ["0", "P0"], ["1", "P1"], ["2", "P2"], ["3", "P3"], ["4", "P4"],
        ["5", "P5"], ["6", "P6"], ["7", "P7"], ["8", "P8"], ["9", "P9"],
        ["10", "P10"], ["11", "P11"], ["12", "P12"], ["13", "P13"]
      ]
    },
    {
      "type": "field_dropdown",
      "name": "tx",
      "options": [
        ["0", "P0"], ["1", "P1"], ["2", "P2"], ["3", "P3"], ["4", "P4"],
        ["5", "P5"], ["6", "P6"], ["7", "P7"], ["8", "P8"], ["9", "P9"],
        ["10", "P10"], ["11", "P11"], ["12", "P12"], ["13", "P13"]
      ]
    }
  ],
  "#37474f",
  "Defines a new global SoftwareSerial port on custom digital pins.",
  ""
);

// 3. Inicializar la velocidad del puerto (Para On start)
newBlock(
  "beginSoftwareSerial",
  "Begin SoftwareSerial %1 with %2 baud",
  [
    { "type": "input_value", "name": "serialname" },
    {
      "type": "field_dropdown",
      "name": "baud",
      "options": [
        ["300", "300"], ["1200", "1200"], ["2400", "2400"], ["4800", "4800"],
        ["9600", "9600"], ["19200", "19200"], ["38400", "38400"], 
        ["57600", "57600"], ["115200", "115200"]
      ]
    }
  ],
  "#37474f",
  "Sets the communication speed for the SoftwareSerial port inside setup.",
  ""
);

// 4. Enviar datos / Imprimir (Para forever)
newBlock(
  "printSoftwareSerial",
  "On SoftwareSerial %1 print %2 %3",
  [
    { "type": "input_value", "name": "serialname" },
    { "type": "input_value", "name": "textToPrint" },
    {
      "type": "field_dropdown",
      "name": "newline",
      "options": [
        ["with newline", "1"],
        ["without newline", "0"]
      ]
    }
  ],
  "#37474f",
  "Sends data through the software serial port.",
  ""
);

// 5. Bloque Reportero: Caracteres disponibles (Para usar en condicionales)
newBlock(
  "availableSoftwareSerial",
  "Number of characters available on SoftwareSerial %1",
  [
    { "type": "input_value", "name": "serialname" }
  ],
  "#37474f",
  "Returns the number of bytes available for reading from the software serial port.",
  "",
  true,
  true   // useVarReporter = true (Retorna un número)
);

// 6. Bloque Reportero: Leer del puerto (Para usar en acciones)
newBlock(
  "readSoftwareSerial",
  "Read from SoftwareSerial %1",
  [
    { "type": "input_value", "name": "serialname" }
  ],
  "#37474f",
  "Returns the next incoming byte from the software serial port.",
  "",
  true,
  true   // useVarReporter = true (Retorna un número/carácter)
);