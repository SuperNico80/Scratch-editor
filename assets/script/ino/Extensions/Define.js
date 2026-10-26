// 1. Bloque para crear el #define (Para usar EXCLUSIVAMENTE en el bloque Header)
newBlock(
  "createDefineConstant",
  "Define constant name %1 with value %2",
  [
    { "type": "input_value", "name": "macroName" },
    { "type": "input_value", "name": "macroValue" }
  ],
  "#9c27b0", // Hermoso color púrpura para distinguir constantes preprocesadas
  "Creates a global preprocessor macro constant.",
  ""
);

// 2. Bloque Reportero para usar la constante (Para usar en forever / setup / if)
newBlock(
  "getDefineConstant",
  "Constant %1",
  [
    { "type": "input_value", "name": "macroName" }
  ],
  "#9c27b0",
  "Returns the value of the defined constant name.",
  "",
  true, // useEvent = false
  true   // useVarReporter = true (Retorna un valor de tipo Atómico)
);