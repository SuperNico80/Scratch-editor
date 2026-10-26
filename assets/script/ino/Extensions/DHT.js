// 1. Incluir la librería (Para el Header)
newBlock(
  "includeDHT",
  "Include this library",
  [],
  "#009688", // Color verde azulado (Teal) para la categoría de sensores ambientales
  "This block includes this library to your sketch.",
  ""
);

// 2. Configurar el sensor globalmente (Para el Header)
newBlock(
  "newDhtSensor",
  "Configure DHT sensor named %1 on pin %2 type %3",
  [
    { "type": "input_value", "name": "dhtname" },
    {
      "type": "field_dropdown",
      "name": "pin",
      "options": [
        ["0", "P0"], ["1", "P1"], ["2", "P2"], ["3", "P3"], ["4", "P4"],
        ["5", "P5"], ["6", "P6"], ["7", "P7"], ["8", "P8"], ["9", "P9"],
        ["10", "P10"], ["11", "P11"], ["12", "P12"], ["13", "P13"],
        ["A0 (14)", "PA0"], ["A1 (15)", "PA1"], ["A2 (16)", "PA2"], 
        ["A3 (17)", "PA3"], ["A4 (18)", "PA4"], ["A5 (19)", "PA5"]
      ]
    },
    {
      "type": "field_dropdown",
      "name": "type",
      "options": [
        ["DHT11 (Blue)", "DHT11"],
        ["DHT22 (White)", "DHT22"],
        ["DHT21", "DHT21"]
      ]
    }
  ],
  "#009688",
  "Defines a new global DHT sensor object with its data pin and model type.",
  ""
);

// 3. Inicializar el sensor en el arranque (Para On start)
newBlock(
  "initDhtSensor",
  "Initialize DHT sensor %1",
  [
    { "type": "input_value", "name": "dhtname" }
  ],
  "#009688",
  "Starts communication parameters for the DHT sensor inside setup.",
  ""
);

// 4. Bloque Reportero: Leer Temperatura (Para usar dentro de acciones)
newBlock(
  "readDhtTemperature",
  "On DHT %1 read temperature in %2", // 🟢 Modificado el texto para admitir el dropdown
  [
    { "type": "input_value", "name": "dhtname" },
    {
      // 🟢 Menú desplegable para seleccionar la escala térmica
      "type": "field_dropdown",
      "name": "scale",
      "options": [
        ["°C (Celsius)", "C"],
        ["°F (Fahrenheit)", "F"]
      ]
    }
  ],
  "#009688",
  "Returns the current ambient temperature value in the selected scale.",
  "",
  true,
  true   // useVarReporter = true (Sigue retornando un número Float)
);
// 5. Bloque Reportero: Leer Humedad (Para usar dentro de acciones)
newBlock(
  "readDhtHumidity",
  "On DHT %1 read humidity in %",
  [
    { "type": "input_value", "name": "dhtname" }
  ],
  "#009688",
  "Returns the current ambient humidity level percentage as a number.",
  "",
  true,
  true   // useVarReporter = true (Retorna un número de tipo Float)
);