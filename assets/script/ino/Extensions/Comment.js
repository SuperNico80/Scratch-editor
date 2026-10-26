newBlock(
  "arduinoComment",
  "Comment: %1", // Texto visual que aparecerá en el bloque
  [
    {
      "type": "field_input",
      "name": "commentText",
      "text": "Write a note here..." // Texto inicial por defecto
    }
  ],
  "#757575", // Un color gris neutro clásico para identificar comentarios en código
  "Adds a descriptive text note that is ignored by the Arduino compiler.",
  ""
);