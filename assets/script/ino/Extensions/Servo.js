// 1. Bloque para incluir la librería Servo (Para el Header)
newBlock(
  "includeServo",
  "Include this library",
  [],
  "#000dff", // Color naranja rojizo para distinguir la categoría
  "This block includes this library to your sketch.",
  ""
);

// 2. Bloque para declarar el objeto Servo (Para el Header)
newBlock(
  "newServo",
  "Configure Servo named %1",
  [
    { "type": "input_value", "name": "servoname" }
  ],
  "#000dff",
  "Defines a new global Servo motor variable.",
  ""
);

// 3. Bloque para vincular el pin físico (Para On start)
newBlock(
  "attachServo",
  "Attach Servo %1 to pin %2",
  [
    { "type": "input_value", "name": "servoname" },
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
  "#000dff",
  "Connects the configured servo variable to a physical Arduino pin.",
  ""
);

// 4. Bloque de acción para girar el motor (Para forever / condicionales)
newBlock(
  "writeServo",
  "Set Servo %1 angle to %2 degrees",
  [
    { "type": "input_value", "name": "servoname" },
    { "type": "input_value", "name": "angle" }
  ],
  "#000dff",
  "Writes an angle value from 0 to 180 degrees to control the servo position.",
  ""
);
// 1. Escribir Microsegundos (Pulsos de precisión para servos de 360° o industriales)
newBlock(
  "writeMicrosecondsServo",
  "Set Servo %1 pulse to %2 microseconds",
  [
    { "type": "input_value", "name": "servoname" },
    { "type": "input_value", "name": "us" }
  ],
  "#000dff",
  "Writes a value in microseconds (uS) to control the servo precisely.",
  ""
);

// 2. Leer la posición actual del Servo (Bloque de Valor / Reporter)
newBlock(
  "readServo",
  "Read current angle of Servo %1",
  [
    { "type": "input_value", "name": "servoname" }
  ],
  "#000dff",
  "Returns the current angle of the servo (last written position).",
  "",
  true, // useEvent = false
  true   // useVarReporter = true (Define que RETORNA un número)
);

// 3. Desvincular/Apagar el Servo (Elimina el consumo de corriente)
newBlock(
  "detachServo",
  "Detach/Turn off Servo %1",
  [
    { "type": "input_value", "name": "servoname" }
  ],
  "#000dff",
  "Disconnects the servo pin logic to stop holding torque and save power.",
  ""
);