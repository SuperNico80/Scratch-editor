// 1. Declarar procedimiento vacío CON argumentos (defineVoidFunc)
newBlock(
  "defineVoidFunc",
  "To function %1 with args (%2) do %3",
  [
    { "type": "input_value", "name": "funcName" },
    { "type": "field_input", "name": "argsList", "text": "int x" }, // 🟢 Caja para declarar argumentos
    { "type": "input_statement", "name": "runcode" }
  ],
  "#009688",
  "Declares a new function with arguments that does not return a value.",
  "",
  true
);

// 2. Llamar procedimiento vacío CON argumentos (callVoidFunc)
newBlock(
  "callVoidFunc",
  "Call function %1 with value %2",
  [
    { "type": "input_value", "name": "funcName" },
    { "type": "input_value", "name": "argsSend" } // 🟢 Ranura para enviar parámetros (ej: un bloque de texto o número)
  ],
  "#009688",
  "Executes the function passing the specified parameters.",
  ""
);

// 3. Declarar función con Retorno y Argumentos (defineValueFunc)
newBlock(
  "defineValueFunc",
  "To function %1 of type %2 with args (%3) %4 return %5",
  [
    { "type": "input_value", "name": "funcName" },
    {
      "type": "field_dropdown",
      "name": "returnType",
      "options": [["int", "int"], ["float", "float"], ["boolean", "bool"], ["byte", "byte"]]
    },
    { "type": "field_input", "name": "argsList", "text": "int x" }, // 🟢 Caja para declarar argumentos
    { "type": "input_statement", "name": "runcode" },
    { "type": "input_value", "name": "returnValue" }
  ],
  "#009688",
  "Declares a new function with arguments that returns a calculated value.",
  "",
  true
);

// 4. Llamar función con Retorno y Argumentos (callValueFunc)
newBlock(
  "callValueFunc",
  "Result of function %1 with value %2",
  [
    { "type": "input_value", "name": "funcName" },
    { "type": "input_value", "name": "argsSend" } // 🟢 Ranura para enviar parámetros
  ],
  "#009688",
  "Returns the calculated value from the function passing the parameters.",
  "",
  true,
  true
);