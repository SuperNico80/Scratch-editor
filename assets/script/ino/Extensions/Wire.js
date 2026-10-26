// Syntax: newBlock(type, message, args, color, toolTip, hlpUrl) {}
newBlock(
  "includeWire",
  "Include this library", // Removed the extra %1 since newBlock adds it automatically
  [],
  "#ff0000",
  "This block includes this library to your sketch. (Only required when using I2C modules)",
  "",
);
newBlock(
  "initLcd",
  "Init LCD in lcd name: %1 with columns: %2 rows: %3", // 🟢 Agregado %1 para indicar dónde se abre la ranura
  [
    {
      "type": "input_value",
      "name": "lcdname"
    },
    {
      // 🟢 Este argumento crea la ranura visual para enganchar bloques dentro
      "type": "input_value",
      "name": "cols",
      "check": "Number"
    },
    {
      // 🟢 Este argumento crea la ranura visual para enganchar bloques dentro
      "type": "input_value",
      "name": "rows",
      "check": "Number"
    }
  ],
  "#ff0000",
  "This block inits a LCD (Only works for sketches that has LiquidCrystal, LiquidCrystal_I2C or Adafruit_LiquidCrystal library installed).",
  "",
);
// 1. Bloque para borrar la pantalla (lcd.clear())
newBlock(
  "lcdI2cClear",
  "Clear LCD screen %1",
  [
    { "type": "input_value", "name": "lcdname" }
  ],
  "#ff0000",
  "Clears the LCD screen and moves the cursor to the top-left corner.",
  ""
);

// 2. Bloque para mover el cursor (lcd.setCursor(col, row))
newBlock(
  "lcdI2cSetCursor",
  "On LCD %1 set cursor to col %2 row %3",
  [
    { "type": "input_value", "name": "lcdname" },
    { "type": "input_value", "name": "cols" },
    { "type": "input_value", "name": "rows" }
  ],
  "#ff0000",
  "Moves the LCD cursor to a specific column and row positioning.",
  ""
);

// 3. Bloque para imprimir texto o números (lcd.print(value))
newBlock(
  "lcdI2cPrint",
  "On LCD %1 print %2",
  [
    { "type": "input_value", "name": "lcdname" },
    { "type": "input_value", "name": "value" }
  ],
  "#ff0000",
  "Prints text, numbers, or variable values onto the LCD screen.",
  ""
);