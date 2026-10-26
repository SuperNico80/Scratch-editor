// 1. Bloque para Declarar la Variable Global (Para usar EXCLUSIVAMENTE en el bloque Header)
newBlock(
  "declareGlobalVar",
  "Create global variable of type %1 named %2 with initial value %3",
  [
    {
      "type": "field_dropdown",
      "name": "varType",
      "options": [
        ["int (Integer)", "int"],
        ["unsigned int", "unsigned int"],
        ["unsigned long", "unsigned long"],
        ["byte (0-255)", "byte"],               // 🟢 Añadido el tipo byte
        ["float (Decimal)", "float"],
        ["boolean", "bool"],
        ["String", "String"]
      ]
    },
    { "type": "input_value", "name": "varName" },
    { "type": "input_value", "name": "varValue" }
  ],
  "#a600ff", 
  "Declares a new mutable global variable at the top of the sketch.",
  ""
);

// 2. Bloque para Modificar / Setear la Variable (Para usar en forever / onStart)
newBlock(
  "setGlobalVar",
  "Set variable %1 to %2",
  [
    { "type": "input_value", "name": "varName" },
    { "type": "input_value", "name": "newValue" }
  ],
  "#a600ff",
  "Assigns a new value to an existing variable.",
  ""
);

// 3. Bloque Reportero para leer la variable (Para usar en cualquier ranura de entrada)
newBlock(
  "getGlobalVar",
  "Variable %1",
  [
    { "type": "input_value", "name": "varName" }
  ],
  "#a600ff",
  "Returns the current value stored in the variable.",
  "",
  true, // useEvent = false
  true   // useVarReporter = true (Retorna un valor de tipo Atómico)
);