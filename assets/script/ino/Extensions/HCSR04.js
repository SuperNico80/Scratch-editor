// 1. Incluir la librería (Para el Header)
newBlock(
  "includeUltrasonic",
  "Include this library",
  [],
  "#00bcd4", // Color cian brillante para la categoría de sensores de distancia
  "This block includes this library to your sketch.",
  ""
);

// 2. Configurar el sensor globalmente (Para el Header)
newBlock(
  "newUltrasonicSensor",
  "Configure Ultrasonic named %1 with Trigger pin %2 Echo pin %3",
  [
    { "type": "input_value", "name": "sensorname" },
    {
      "type": "field_dropdown",
      "name": "trigger",
      "options": [
        ["0", "P0"], ["1", "P1"], ["2", "P2"], ["3", "P3"], ["4", "P4"],
        ["5", "P5"], ["6", "P6"], ["7", "P7"], ["8", "P8"], ["9", "P9"],
        ["10", "P10"], ["11", "P11"], ["12", "P12"], ["13", "P13"]
      ]
    },
    {
      "type": "field_dropdown",
      "name": "echo",
      "options": [
        ["0", "P0"], ["1", "P1"], ["2", "P2"], ["3", "P3"], ["4", "P4"],
        ["5", "P5"], ["6", "P6"], ["7", "P7"], ["8", "P8"], ["9", "P9"],
        ["10", "P10"], ["11", "P11"], ["12", "P12"], ["13", "P13"]
      ]
    }
  ],
  "#00bcd4",
  "Defines a new global HC-SR04 ultrasonic distance sensor object.",
  ""
);

// 3. Bloque Reportero: Medir Distancia (Para usar dentro de acciones/lógicas)
newBlock(
  "readUltrasonicDistance",
  "On Ultrasonic %1 read distance in %2", // 🟢 Modificado el texto para admitir el menú desplegable
  [
    { "type": "input_value", "name": "sensorname" },
    {
      // 🟢 Menú desplegable para seleccionar la unidad de medida
      "type": "field_dropdown",
      "name": "unit",
      "options": [
        ["cm (Centimeters)", "CM"],
        ["inches (Pulgadas)", "INCHES"]
      ]
    }
  ],
  "#00bcd4",
  "Returns the current distance reading in the selected unit as a number.",
  "",
  true,
  true   // useVarReporter = true (Sigue retornando un número decimal)
);