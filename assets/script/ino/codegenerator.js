// Initialize Custom Generator
const ArduinoGenerator = new Blockly.Generator('Arduino');
// 1. Inicializar el generador principal
//const ArduinoGenerator = new Blockly.Generator('Arduino');
ArduinoGenerator.ORDER_ATOMIC = 0;
ArduinoGenerator.ORDER_NONE = 99;

// 2. 🟢 PROTECCIÓN: Asegurar que los contenedores existan SIEMPRE como arreglos vacíos
ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
ArduinoGenerator.setupLines = ArduinoGenerator.setupLines || [];
ArduinoGenerator.loopLines = ArduinoGenerator.loopLines || [];
// Define Precedence (C++ guidelines)
ArduinoGenerator.ORDER_ATOMIC = 0;   // Literals, function calls, variable names
ArduinoGenerator.ORDER_UNARY = 3;    // ! (not)
ArduinoGenerator.ORDER_MULTIPLICATIVE = 5; // * , / , %
ArduinoGenerator.ORDER_ADDITIVE = 6;       // + , -
ArduinoGenerator.ORDER_RELATIONAL = 8;     // < , <= , > , >=
ArduinoGenerator.ORDER_EQUALITY = 9;       // == , !=
ArduinoGenerator.ORDER_NONE = 99;    // Fallback/Statements
ArduinoGenerator.ORDER_LOGICAL_AND = 13;   // &&
ArduinoGenerator.ORDER_LOGICAL_OR = 14;    // ||

// 1. definePin
ArduinoGenerator.forBlock['definePin'] = (block) => {
  const pin = block.getFieldValue('selectedPin').replace('P', ''); // Converts "P13" -> "13"
  const state = block.getFieldValue('val') === 'S1' ? 'HIGH' : 'LOW';
  return `digitalWrite(${pin}, ${state});\n`;
};

// 2. definePinToVar (PWM / Analog out)
ArduinoGenerator.forBlock['definePinToVar'] = (block, generator) => {
  const pin = block.getFieldValue('selectedPin').replace('P', '');
  const val = generator.valueToCode(block, 'val', ArduinoGenerator.ORDER_ATOMIC) || '0';
  return `analogWrite(${pin}, ${val});\n`;
};

// 3. defineLed
ArduinoGenerator.forBlock['defineLed'] = (block) => {
  const state = block.getFieldValue('val') === 'S1' ? 'HIGH' : 'LOW';
  return `digitalWrite(LED_BUILTIN, ${state});\n`;
};

// 4. playSpkr
ArduinoGenerator.forBlock['playSpkr'] = (block, generator) => {
  const pin = block.getFieldValue('selectedPin').replace('P', '');
  const toneVal = generator.valueToCode(block, 'tone', ArduinoGenerator.ORDER_ATOMIC) || '440';
  const duration = generator.valueToCode(block, 'seconds', ArduinoGenerator.ORDER_ATOMIC) || '1';
  // Arduino tone uses milliseconds, multiply duration by 1000
  return `tone(${pin}, ${toneVal}, ${duration} * 1000);\n`;
};

// 5. stopSpkr
ArduinoGenerator.forBlock['stopSpkr'] = (block) => {
  const pin = block.getFieldValue('selectedPin').replace('P', '');
  return `noTone(${pin});\n`;
};

// 6. serialPrnt
ArduinoGenerator.forBlock['serialPrnt'] = (block, generator) => {
  const text = generator.valueToCode(block, 'textToPrint', ArduinoGenerator.ORDER_ATOMIC) || '""';
  const newline = block.getFieldValue('selectedPin') === '1' ? 'ln' : '';
  return `Serial.print${newline}(${text});\n`;
};
// 7. onStart (Actualizado para fusionar)
ArduinoGenerator.forBlock['onStart'] = (block, generator) => {
  const codeInside = generator.statementToCode(block, 'runcode');
  if (codeInside) {
    ArduinoGenerator.setupLines.push(codeInside);
  }
  return ''; // No retorna nada aquí, se procesa en el finish()
};

// 8. forever (Actualizado para fusionar)
ArduinoGenerator.forBlock['forever'] = (block, generator) => {
  const codeInside = generator.statementToCode(block, 'runcode');
  if (codeInside) {
    ArduinoGenerator.loopLines.push(codeInside);
  }
  return ''; // No retorna nada aquí, se procesa en el finish()
};
// 9. wait
ArduinoGenerator.forBlock['wait'] = (block, generator) => {
  const seconds = generator.valueToCode(block, 'wait', ArduinoGenerator.ORDER_ATOMIC) || '1';
  // Arduino delay functions handle milliseconds
  return `delay(${seconds} * 1000);\n`;
};

// 10. repeat
ArduinoGenerator.forBlock['repeat'] = (block, generator) => {
  const times = generator.valueToCode(block, 'wait', ArduinoGenerator.ORDER_ATOMIC) || '10';
  const codeInside = generator.statementToCode(block, 'runcode');
  // Use a generated unique index variable so nested loops don't conflict
  const loopVar = `i_${Math.floor(Math.random() * 1000)}`;
  return `for (int ${loopVar} = 0; ${loopVar} < ${times}; ${loopVar}++) {\n${codeInside}}\n`;
};

// 11. repeatwhile
ArduinoGenerator.forBlock['repeatwhile'] = (block, generator) => {
  const mode = block.getFieldValue('wait') === '1' ? 'while' : 'while (!';
  const closeMode = block.getFieldValue('wait') === '1' ? '' : ')';
  const condition = generator.valueToCode(block, 'condition', ArduinoGenerator.ORDER_ATOMIC) || 'true';
  const codeInside = generator.statementToCode(block, 'runcode');
  return `${mode}(${condition}${closeMode}) {\n${codeInside}}\n`;
};
// 12. math_map_range
ArduinoGenerator.forBlock['math_map_range'] = (block, generator) => {
  const val = generator.valueToCode(block, 'VALUE', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const fLow = generator.valueToCode(block, 'FROM_LOW', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const fHigh = generator.valueToCode(block, 'FROM_HIGH', ArduinoGenerator.ORDER_ATOMIC) || '1023';
  const tLow = generator.valueToCode(block, 'TO_LOW', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const tHigh = generator.valueToCode(block, 'TO_HIGH', ArduinoGenerator.ORDER_ATOMIC) || '255';
  
  const code = `map(${val}, ${fLow}, ${fHigh}, ${tLow}, ${tHigh})`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// 13. math_constrain_range
ArduinoGenerator.forBlock['math_constrain_range'] = (block, generator) => {
  const val = generator.valueToCode(block, 'VALUE', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const low = generator.valueToCode(block, 'TO_LOW', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const high = generator.valueToCode(block, 'TO_HIGH', ArduinoGenerator.ORDER_ATOMIC) || '255';
  
  const code = `constrain(${val}, ${low}, ${high})`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};
// 14. readdigital
ArduinoGenerator.forBlock['readdigital'] = (block) => {
  const pin = block.getFieldValue('pin').replace('P', '');
  return [`digitalRead(${pin})`, ArduinoGenerator.ORDER_ATOMIC];
};

// 15. readanalog
ArduinoGenerator.forBlock['readanalog'] = (block) => {
  const pin = block.getFieldValue('pin').replace('P', '');
  return [`analogRead(${pin})`, ArduinoGenerator.ORDER_ATOMIC];
};

// 16. serialnum
ArduinoGenerator.forBlock['serialnum'] = () => {
  return ['Serial.available()', ArduinoGenerator.ORDER_ATOMIC];
};

// 17. serialread
ArduinoGenerator.forBlock['serialread'] = () => {
  return ['Serial.read()', ArduinoGenerator.ORDER_ATOMIC];
};

// 18. tempread
ArduinoGenerator.forBlock['tempread'] = (block) => {
  const pin = block.getFieldValue('pin').replace('P', '');
  const units = block.getFieldValue('units');
  
  // Basic computational conversion block logic for generic thermistors
  let code = `(analogRead(${pin}) * 0.48828125)`; // Formula for LM35 sensor in °C
  if (units === 'f') {
    code = `((${code} * 9.0 / 5.0) + 32.0)`;
  }
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// 19. infaread
ArduinoGenerator.forBlock['infaread'] = (block) => {
  const pin = block.getFieldValue('pin').replace('P', '');
  // Typically an infrared barrier/receiver yields inverted digital input signals
  return [`digitalRead(${pin})`, ArduinoGenerator.ORDER_ATOMIC];
};
const compileBlocksToArduino = () => {
  // Pass the target runtime blockly workspace container object variable
  const finalInoCode = ArduinoGenerator.workspaceToCode(workspace);
  
  // Render output onto an active pre-formatted HTML tag container
  document.getElementById('codeOutputBox').textContent = finalInoCode;
};

// 20. pinMode
ArduinoGenerator.forBlock['pinMode'] = (block) => {
  // 1. Extraer el número del pin (ej: "P13" -> "13")
  const pin = block.getFieldValue('pin').replace('P', '');
  
  // 2. Extraer el modo seleccionado ("OUTPUT", "INPUT", "INPUT_PULLUP")
  const mode = block.getFieldValue('mode');
  
  // 3. Retornar la instrucción nativa de Arduino C++
  return `pinMode(${pin}, ${mode});\n`;
};

// --- 1. BLOQUE DE NÚMEROS (math_number) ---
ArduinoGenerator.forBlock['math_number'] = (block) => {
  const code = String(block.getFieldValue('NUM'));
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 2. OPERACIONES ARITMÉTICAS (math_arithmetic: +, -, *, /, ^) ---
ArduinoGenerator.forBlock['math_arithmetic'] = (block, generator) => {
  // Operadores en C++
  const OPERATORS = {
    'ADD': [' + ', ArduinoGenerator.ORDER_ADDITIVE],
    'MINUS': [' - ', ArduinoGenerator.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', ArduinoGenerator.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', ArduinoGenerator.ORDER_MULTIPLICATIVE],
    'POWER': [null, ArduinoGenerator.ORDER_NONE] // Arduino no tiene operador nativo ^ para potencias (usa pow())
  };
  
  const tuple = OPERATORS[block.getFieldValue('OP')];
  const operator = tuple[0];
  const order = tuple[1];
  
  // Si es potencia, procesar de manera especial con la función pow() de C++
  if (!operator) {
    const base = generator.valueToCode(block, 'A', ArduinoGenerator.ORDER_ATOMIC) || '0';
    const exp = generator.valueToCode(block, 'B', ArduinoGenerator.ORDER_ATOMIC) || '0';
    return [`pow(${base}, ${exp})`, ArduinoGenerator.ORDER_ATOMIC];
  }
  
  const argument0 = generator.valueToCode(block, 'A', order) || '0';
  const argument1 = generator.valueToCode(block, 'B', order) || '0';
  const code = argument0 + operator + argument1;
  return [code, order];
};

// --- 3. COMPARACIONES LOGICAS (logic_compare: ==, !=, <, >, <=, >=) ---
ArduinoGenerator.forBlock['logic_compare'] = (block, generator) => {
  const OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const order = (operator === '==' || operator === '!=') ? 
                 ArduinoGenerator.ORDER_EQUALITY : ArduinoGenerator.ORDER_RELATIONAL;
                 
  const argument0 = generator.valueToCode(block, 'A', order) || '0';
  const argument1 = generator.valueToCode(block, 'B', order) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

// --- 4. OPERACIONES BOOLEANAS (logic_operation: AND, OR) ---
ArduinoGenerator.forBlock['logic_operation'] = (block, generator) => {
  const operator = (block.getFieldValue('OP') === 'AND') ? '&&' : '||';
  const order = (operator === '&&') ? ArduinoGenerator.ORDER_LOGICAL_AND : ArduinoGenerator.ORDER_LOGICAL_OR;
  
  const argument0 = generator.valueToCode(block, 'A', order) || 'false';
  const argument1 = generator.valueToCode(block, 'B', order) || 'false';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

// --- 5. NEGACIÓN (logic_negate: NOT) ---
ArduinoGenerator.forBlock['logic_negate'] = (block, generator) => {
  const order = ArduinoGenerator.ORDER_UNARY;
  const argument0 = generator.valueToCode(block, 'BOOL', order) || 'false';
  const code = '!' + argument0;
  return [code, order];
};

// --- 6. VALORES BOOLEANOS DIRECTOS (logic_boolean: true/false) ---
ArduinoGenerator.forBlock['logic_boolean'] = (block) => {
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// Live real-time workspace parsing sync callback hook
workspace.addChangeListener((event) => {
  if (event.isUiEvent) return; // Disregard clicks/scroll movements
  compileBlocksToArduino();
});

//const ArduinoGenerator = new Blockly.Generator('Arduino');
//ArduinoGenerator.ORDER_ATOMIC = 0;
//ArduinoGenerator.ORDER_NONE = 99;

// 🟢 Inicializar contenedores de código limpios
ArduinoGenerator.setupLines = [];
ArduinoGenerator.loopLines = [];

// 🟢 Esta función une todo de forma correcta ANTES de entregar el código final
ArduinoGenerator.finish = function(code) {
  const finalSetup = ArduinoGenerator.setupLines.join('');
  const finalLoop = ArduinoGenerator.loopLines.join('');
  
  // Limpiamos los acumuladores para la siguiente generación en tiempo real
  ArduinoGenerator.setupLines = [];
  ArduinoGenerator.loopLines = [];
  
  // Estructura final unificada y limpia de Arduino
  return `void setup() {\n${finalSetup}}\n\nvoid loop() {\n${finalLoop}}\n`;
};
ArduinoGenerator.forBlock['serialBegin'] = (block) => {
  // 1. Extraer los baudios seleccionados de forma directa (ej: "9600")
  const baudRate = block.getFieldValue('baud');
  
  // 2. Retornar la instrucción de configuración nativa de Arduino C++
  return `Serial.begin(${baudRate});\n`;
};
ArduinoGenerator.forBlock['serialPrnt'] = (block, generator) => {
  const text = generator.valueToCode(block, 'textToPrint', ArduinoGenerator.ORDER_ATOMIC) || '""';
  const newline = block.getFieldValue('selectedPin') === '1' ? 'ln' : '';
  
  // 🔍 BUSCAR SI EXISTE EL BLOQUE 'serialBegin' EN TODO EL WORKSPACE
  // block.workspace contiene la referencia al espacio de trabajo actual
  const allBlocks = block.workspace.getAllBlocks(false);
  const hasSerialBegin = allBlocks.some(b => b.type === 'serialBegin');

  if (!hasSerialBegin) {
    // 🟡 Mostrar una advertencia visual en el bloque (Icono de '!')
    block.setWarningText('Warning: you need to add the block "Begin Serial" to use this block.');
    
    // 🛡️ Respaldo de seguridad: Forzar un inicio por defecto en las líneas de Setup
    // Usamos .includes para asegurarnos de no duplicar este respaldo si hay múltiples bloques de texto
    const setupCode = '  Serial.begin(9600); // Started automatically by security\n';
    if (!ArduinoGenerator.setupLines.includes(setupCode)) {
      ArduinoGenerator.setupLines.push(setupCode);
    }
  } else {
    // 🟢 Si ya colocó el bloque, remover la advertencia visual
    block.setWarningText(null);
  }

  return `Serial.print${newline}(${text});\n`;
};
// --- GENERADOR DEL INCLUDE ---
ArduinoGenerator.forBlock['includeLiquidCrystal'] = (block) => {
  const includeCode = '#include <LiquidCrystal.h>\n';
  
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  
  // 🟢 Buscar si hay pantallas en el workspace para limpiar sus advertencias de inmediato
  const screens4 = block.workspace.getBlocksByType('newLcd4Screen');
  const screens8 = block.workspace.getBlocksByType('newLcd8Screen');
  [...screens4, ...screens8].forEach(b => b.setWarningText(null));
  
  return ''; 
};

const cleanPin = (block, fieldName) => block.getFieldValue(fieldName).replace('P', '');

// --- GENERADOR LCD 4-BITS (CON VALIDACIÓN) ---
ArduinoGenerator.forBlock['newLcd4Screen'] = (block) => {
  const rs = cleanPin(block, 'RS');
  const e  = cleanPin(block, 'E');
  const n4 = cleanPin(block, 'N4');
  const n5 = cleanPin(block, 'N5');
  const n6 = cleanPin(block, 'N6');
  const n7 = cleanPin(block, 'N7');

  // 🔍 VALIDACIÓN: Buscar si el bloque 'includeLiquidCrystal' existe en el espacio de trabajo
  const allBlocks = block.workspace.getAllBlocks(false);
  const hasInclude = allBlocks.some(b => b.type === 'includeLiquidCrystal');
  const includeCode = '#include <LiquidCrystal.h>\n';

  if (!hasInclude) {
    // 🟡 Si no existe, muestra advertencia e inyecta la librería por seguridad
    block.setWarningText('Warning: It is recommended to use the block "Include this library" to use this block.');
    if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
      ArduinoGenerator.definitionsLines.push(includeCode);
    }
  } else {
    // 🟢 Si ya existe, remueve la advertencia visual
    block.setWarningText(null);
  }

  const instance = `LiquidCrystal lcd(${rs}, ${e}, ${n4}, ${n5}, ${n6}, ${n7});\n`;
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }

  return '  lcd.begin(16, 2);\n';
};

// --- GENERADOR LCD 8-BITS (CON VALIDACIÓN) ---
ArduinoGenerator.forBlock['newLcd8Screen'] = (block) => {
  const rs = cleanPin(block, 'RS');
  const e  = cleanPin(block, 'E');
  const n0 = cleanPin(block, 'N0');
  const n1 = cleanPin(block, 'N1');
  const n2 = cleanPin(block, 'N2');
  const n3 = cleanPin(block, 'N3');
  const n4 = cleanPin(block, 'N4');
  const n5 = cleanPin(block, 'N5');
  const n6 = cleanPin(block, 'N6');
  const n7 = cleanPin(block, 'N7');

  // 🔍 VALIDACIÓN: Buscar si el bloque 'includeLiquidCrystal' existe en el espacio de trabajo
  const allBlocks = block.workspace.getAllBlocks(false);
  const hasInclude = allBlocks.some(b => b.type === 'includeLiquidCrystal');
  const includeCode = '#include <LiquidCrystal.h>\n';

  if (!hasInclude) {
    // 🟡 Si no existe, muestra advertencia e inyecta la librería por seguridad
    block.setWarningText('Warning: It is recommended to use the block "Include this library" to use this block.');
    if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
      ArduinoGenerator.definitionsLines.push(includeCode);
    }
  } else {
    // 🟢 Si ya existe, remueve la advertencia visual
    block.setWarningText(null);
  }

  const instance = `LiquidCrystal lcd(${rs}, ${e}, ${n0}, ${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ${n6}, ${n7});\n`;
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }

  return '  lcd.begin(16, 2);\n';
};