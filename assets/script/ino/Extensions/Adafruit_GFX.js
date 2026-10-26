newBlock(
  "includeAdafruitGFX",
  "Include this library",
  [],
  "#1a237e", // Tono celeste oscuro/cian para diferenciar la variante de Adafruit
  "his block includes this library to your sketch.",
  ""
);
// 1. Dibujar una línea recta (display.drawLine(x0, y0, x1, y1, color))
newBlock(
  "gfxDrawLine",
  "On Graphic Display %1 draw line from x0 %2 y0 %3 to x1 %4 y1 %5",
  [
    { "type": "input_value", "name": "displayname" },
    { "type": "input_value", "name": "x0" },
    { "type": "input_value", "name": "y0" },
    { "type": "input_value", "name": "x1" },
    { "type": "input_value", "name": "y1" }
  ],
  "#1a237e", // Azul marino oscuro para distinguir las herramientas primitivas de GFX
  "Draws a straight line between two coordinate points.",
  ""
);

// 2. Dibujar un rectángulo (display.drawRect / fillRect)
newBlock(
  "gfxDrawRect",
  "On Graphic Display %1 draw rectangle at x %2 y %3 width %4 height %5 mode %6",
  [
    { "type": "input_value", "name": "displayname" },
    { "type": "input_value", "name": "x" },
    { "type": "input_value", "name": "y" },
    { "type": "input_value", "name": "w" },
    { "type": "input_value", "name": "h" },
    {
      "type": "field_dropdown",
      "name": "mode",
      "options": [
        ["Outline (Empty)", "drawRect"],
        ["Filled (Full)", "fillRect"]
      ]
    }
  ],
  "#1a237e",
  "Draws a rectangle on the screen with optional color fill.",
  ""
);

// 3. Dibujar un círculo (display.drawCircle / fillCircle)
newBlock(
  "gfxDrawCircle",
  "On Graphic Display %1 draw circle at center x %2 y %3 radius %4 mode %5",
  [
    { "type": "input_value", "name": "displayname" },
    { "type": "input_value", "name": "x" },
    { "type": "input_value", "name": "y" },
    { "type": "input_value", "name": "r" },
    {
      "type": "field_dropdown",
      "name": "mode",
      "options": [
        ["Outline (Empty)", "drawCircle"],
        ["Filled (Full)", "fillCircle"]
      ]
    }
  ],
  "#1a237e",
  "Draws a perfect circle based on center coordinates and radius length.",
  ""
);

// 4. Dibujar un rectángulo redondeado (display.drawRoundRect / fillRoundRect)
newBlock(
  "gfxDrawRoundRect",
  "On Graphic Display %1 draw rounded rectangle at x %2 y %3 width %4 height %5 corner radius %6 mode %7",
  [
    { "type": "input_value", "name": "displayname" },
    { "type": "input_value", "name": "x" },
    { "type": "input_value", "name": "y" },
    { "type": "input_value", "name": "w" },
    { "type": "input_value", "name": "h" },
    { "type": "input_value", "name": "r" },
    {
      "type": "field_dropdown",
      "name": "mode",
      "options": [
        ["Outline (Empty)", "drawRoundRect"],
        ["Filled (Full)", "fillRoundRect"]
      ]
    }
  ],
  "#1a237e",
  "Draws a rectangle with smoothly rounded corners.",
  ""
);