newBlock(
  "newI2cScreen",
  "Configure I2C LCD screen with direction: %1 cols: %2 rows: %3  name: %4", // 🟢 Texto con los 4 parámetros
  [
    {
      // 🟢 %1 = Dirección hexadecimal (field_dropdown)
      type: "field_dropdown",
      name: "address",
      options: [
        ["0x27 (Standard)", "0x27"],
        ["0x3F", "0x3F"],
        ["0x20", "0x20"],
      ]
    },
        {
      // 🟢 %2 = Columnas (input_value)
      type: "input_value",
      name: "cols"
    },
    {
      // 🟢 %3 = Filas (input_value)
      type: "input_value",
      name: "rows"
    },
    {
      // 🟢 %4 = Nombre de la pantalla (input_value)
      type: "input_value",
      name: "lcdname"
    }
  ],
  "#00ff11",
  "Defines a new global I2C LCD screen with completely customized parameters.",
  ""
);
newBlock(
  "includeLiquidCrystalI2C",
  "Include this library", 
  [
  ],
  "#00ff11",
  "This block includes this library to your sketch.",
  ""
);
newBlock(
  "initI2cScreen",
  "Initialize I2C LCD %1",
  [
    { "type": "input_value", "name": "lcdname" }
  ],
  "#00ff11",
  "Starts communication with the I2C display and turns on backlight.",
  ""
);
