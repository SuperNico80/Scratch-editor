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
// 🟢 ARDUINOGENERATOR.FINISH RECURSIVO Y COMPLETO
ArduinoGenerator.functionsLines = [];

ArduinoGenerator.finish = function(code) {
  ArduinoGenerator.definitionsLines = [];
  ArduinoGenerator.setupLines = [];
  ArduinoGenerator.loopLines = [];
  // 🟢 Inicializar contenedor de funciones limpio
  ArduinoGenerator.functionsLines = [];

  const activeWorkspace = Blockly.common.getMainWorkspace(); 
  if (!activeWorkspace) return '';

  const topBlocks = activeWorkspace.getTopBlocks(false);

  // [Paso A: Procesar headerEvent...]
  const headerBlocks = topBlocks.filter(b => b.type === 'headerEvent');
  headerBlocks.forEach(headerBlock => {
    let currentBlock = headerBlock.getInputTargetBlock('runcode');
    while (currentBlock) {
      const mappingFunc = ArduinoGenerator.forBlock[currentBlock.type];
      if (mappingFunc) mappingFunc(currentBlock, ArduinoGenerator);
      currentBlock = currentBlock.getNextBlock();
    }
  });

  // 🟢 PASO MAESTRO NUEVO: Buscar y ejecutar primero las definiciones de funciones
  // Esto hace que llenen de forma interna el arreglo ArduinoGenerator.functionsLines
  const funcDefineBlocks = topBlocks.filter(b => b.type === 'defineVoidFunc' || b.type === 'defineValueFunc');
  funcDefineBlocks.forEach(funcBlock => {
    const mappingFunc = ArduinoGenerator.forBlock[funcBlock.type];
    if (mappingFunc) mappingFunc(funcBlock, ArduinoGenerator);
  });

  // [Paso B: Procesar onStart...]
  const startBlocks = topBlocks.filter(b => b.type === 'onStart');
  startBlocks.forEach(startBlock => {
    let currentBlock = startBlock.getInputTargetBlock('runcode');
    while (currentBlock) {
      const mappingFunc = ArduinoGenerator.forBlock[currentBlock.type];
      if (mappingFunc) {
        const blockResult = mappingFunc(currentBlock, ArduinoGenerator);
        if (blockResult && typeof blockResult === 'string') ArduinoGenerator.setupLines.push(blockResult);
      }
      currentBlock = currentBlock.getNextBlock();
    }
  });

  // [Paso C: Procesar forever...]
  const loopBlocks = topBlocks.filter(b => b.type === 'forever');
  loopBlocks.forEach(loopBlock => {
    let currentBlock = loopBlock.getInputTargetBlock('runcode');
    while (currentBlock) {
      const mappingFunc = ArduinoGenerator.forBlock[currentBlock.type];
      if (mappingFunc) {
        const blockResult = mappingFunc(currentBlock, ArduinoGenerator);
        if (blockResult && typeof blockResult === 'string') ArduinoGenerator.loopLines.push(blockResult);
      }
      currentBlock = currentBlock.getNextBlock();
    }
  });

  // Unir todas las piezas estructurales
  const finalDefinitions = ArduinoGenerator.definitionsLines.join('');
  const finalSetup = ArduinoGenerator.setupLines.join('');
  const finalLoop = ArduinoGenerator.loopLines.join('');
  const finalFunctions = ArduinoGenerator.functionsLines.join('');
  
  // Imprime las funciones abajo del todo de forma profesional
  return `${finalDefinitions}\nvoid setup() {\n${finalSetup}}\n\nvoid loop() {\n${finalLoop}}\n\n${finalFunctions}`;
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
  
  //return `${includeCode}`; 
  return '';
};
ArduinoGenerator.forBlock['includeWire'] = (block) => {
  const includeCode = '#include <Wire.h>\n';
  
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  
  
  //return `${includeCode}`; 
  return '';
};
ArduinoGenerator.forBlock['includeLiquidCrystalI2C'] = (block) => {
  checkLcdI2cDependency(block)
  const includeCode = '#include <LiquidCrystal_I2C.h>\n';
  
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  
  
  //return `${includeCode}`; 
  return '';
};

const cleanPin = (block, fieldName) => block.getFieldValue(fieldName).replace('P', '');

// --- GENERADOR LCD 4-BITS CON INPUT_VALUE ---
ArduinoGenerator.forBlock['newLcd4Screen'] = (block, generator) => {
  // 🟢 SOLUCIÓN: Usar valueToCode en lugar de getFieldValue
  // ORDER_ATOMIC es el más alto, ideal para nombres de variables puros.
  // El fallback 'lcd' asegura que si el usuario deja la ranura vacía, el código no se rompa.
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  
  // 🧹 Limpieza extra de comillas: Si el bloque de texto adjunto inyecta comillas dobles (ej: "lcd1"),
  // las removemos usando un replace para que en C++ quede como un nombre de variable válido: lcd1.
  lcdName = lcdName.replace(/['"]+/g, '');

  const rs = cleanPin(block, 'RS');
  const e  = cleanPin(block, 'E');
  const n4 = cleanPin(block, 'N4');
  const n5 = cleanPin(block, 'N5');
  const n6 = cleanPin(block, 'N6');
  const n7 = cleanPin(block, 'N7');

  const instance = `LiquidCrystal ${lcdName}(${rs}, ${e}, ${n4}, ${n5}, ${n6}, ${n7});\n`;
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return ''; 
};

// --- GENERADOR LCD 8-BITS CON INPUT_VALUE ---
ArduinoGenerator.forBlock['newLcd8Screen'] = (block, generator) => {
  // 🟢 Extraer nombre dinámico desde la ranura de entrada de valor
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, '');

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

  const instance = `LiquidCrystal ${lcdName}(${rs}, ${e}, ${n0}, ${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ${n6}, ${n7});\n`;
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return ''; 
};
// --- NUEVO EVENTO: headerEvent ---
ArduinoGenerator.forBlock['headerEvent'] = (block, generator) => {
  // 1. Asegurar que el contenedor global exista
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];

  // 2. Obtener el primer bloque que está metido dentro de la ranura "runcode"
  let currentBlock = block.getInputTargetBlock('runcode');

  // 3. Recorrer en cadena todos los bloques que estén conectados ahí dentro
  while (currentBlock) {
    // Traducir el bloque actual de forma aislada
    let blockCode = generator.blockToCode(currentBlock);
    
    // Si el bloque regresó código válido y no está duplicado, lo guardamos arriba
    if (blockCode && !ArduinoGenerator.definitionsLines.includes(blockCode)) {
      ArduinoGenerator.definitionsLines.push(blockCode);
    }
    
    // Avanzar al siguiente bloque que esté conectado abajo del actual
    currentBlock = currentBlock.getNextBlock();
  }

  // Este bloque de evento raíz no escribe código en cascada hacia abajo
  return '';
};


// 🟢 REEMPLAZAR POR COMPLETO LA FUNCIÓN SCRUB_ POR ESTA VERSIÓN LIMPIA
ArduinoGenerator.scrub_ = function(block, code, thisOnly) {
  const nextBlock = block.getNextBlock();
  const generator = this; // Hace referencia a ArduinoGenerator de forma dinámica
  
  // Si hay un bloque conectado abajo, el motor lo traduce automáticamente aquí
  const nextCode = nextBlock ? generator.blockToCode(nextBlock) : '';
  
  return code + nextCode;
};


// --- GENERADOR initLcd ACTUALIZADO CON COLS Y ROWS (INPUT_VALUE) ---
ArduinoGenerator.forBlock['initLcd'] = (block, generator) => {
  // 1. Extraer el nombre de la variable de la pantalla y limpiar sus comillas
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, '');
  
  // 2. Extraer el valor de las Columnas (cols). Fallback por defecto: 16
  const cols = generator.valueToCode(block, 'cols', ArduinoGenerator.ORDER_ATOMIC) || '16';
  
  // 3. Extraer el valor de las Filas (rows). Fallback por defecto: 2
  const rows = generator.valueToCode(block, 'rows', ArduinoGenerator.ORDER_ATOMIC) || '2';
  
  // 4. Retornar la instrucción nativa dinámica para el void setup()
  return `  ${lcdName}.begin(${cols}, ${rows});\n`;
};

ArduinoGenerator.forBlock['controls_if'] = (block, generator) => {
  let n = 0;
  let code = '';
  
  do {
    const condition = generator.valueToCode(block, 'IF' + n, ArduinoGenerator.ORDER_NONE) || 'false';
    // 🟢 Es vital pasar 'generator' como tercer argumento aquí
    const branch = generator.statementToCode(block, 'DO' + n, generator);
    
    code += (n > 0 ? 'else ' : '') + `if (${condition}) {\n${branch}}\n`;
    n++;
  } while (block.getInput('IF' + n));
  
  if (block.getInput('ELSE')) {
    const branch = generator.statementToCode(block, 'ELSE', generator);
    code += `else {\n${branch}}\n`;
  }
  
  return code;
};
const checkLcdI2cDependency = (block) => {
  const allBlocks = block.workspace.getAllBlocks(false);
  const hasBaseSensor = allBlocks.some(b => b.type === 'includeWire');
  const sensorLib = '#include <Wire.h>\n';

  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];

  if (!hasBaseSensor) {
    // 🟡 Si no está el bloque en el lienzo, muestra la alerta visual en el bloque actual
    block.setWarningText('Warning: It is recommended to add the "Include this library" of Wire category to use this block.');
    
    // 🛡️ Inyección de respaldo por seguridad para que compile de todos modos
    if (!ArduinoGenerator.definitionsLines.includes(sensorLib)) {
      ArduinoGenerator.definitionsLines.push(sensorLib);
    }
  } else {
    // 🟢 Si el bloque ya existe en el espacio de trabajo, removemos la advertencia visual
    block.setWarningText(null);
  }
};
// --- 1. COMANNDO CLEAR ---
ArduinoGenerator.forBlock['lcdI2cClear'] = (block, generator) => {
  
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, ''); // Limpiar comillas del nombre de la variable
  
  return `  ${lcdName}.clear();\n`;
};

// --- 2. COMANDO SET CURSOR ---
ArduinoGenerator.forBlock['lcdI2cSetCursor'] = (block, generator) => {
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, '');
  
  const cols = generator.valueToCode(block, 'cols', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const rows = generator.valueToCode(block, 'rows', ArduinoGenerator.ORDER_ATOMIC) || '0';
  
  return `  ${lcdName}.setCursor(${cols}, ${rows});\n`;
};

// --- 3. COMANDO PRINT ---
ArduinoGenerator.forBlock['lcdI2cPrint'] = (block, generator) => {
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, '');
  
  // Extraemos el valor a imprimir (puede ser un bloque de texto, un número o una lectura de pin)
  // No le quitamos las comillas a este resultado para que C++ distinga un string de una variable.
  const value = generator.valueToCode(block, 'value', ArduinoGenerator.ORDER_ATOMIC) || '""';
  
  return `  ${lcdName}.print(${value});\n`;
};
// --- GENERADOR TOTALMENTE DINÁMICO PARA CONFIGURACIÓN I2C ---
ArduinoGenerator.forBlock['newI2cScreen'] = (block, generator) => {
  checkLcdI2cDependency(block)
  // 1. Extraer la dirección hexadecimal desde el desplegable (%1)
  const address = block.getFieldValue('address') || '0x27';

  // 2. Extraer el nombre de la variable desde la ranura de valor (%2) y limpiar comillas
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, '');
  
  // 3. Extraer las Columnas (%3). Fallback: 16
  const cols = generator.valueToCode(block, 'cols', ArduinoGenerator.ORDER_ATOMIC) || '16';
  
  // 4. Extraer las Filas (%4). Fallback: 2
  const rows = generator.valueToCode(block, 'rows', ArduinoGenerator.ORDER_ATOMIC) || '2';
  
  // 5. Crear la declaración del objeto global de C++ usando TODOS los datos dinámicos
  const instance = `LiquidCrystal_I2C ${lcdName}(${address}, ${cols}, ${rows});\n`;
  
  // 6. Inyectar de forma segura en la sección externa superior del archivo .ino
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  
  // Retorna un string vacío para asegurar que no se filtre código dentro de funciones
  return ''; 
};
ArduinoGenerator.forBlock['initI2cScreen'] = (block, generator) => {
  checkLcdI2cDependency(block)
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, '');
  
  // En las pantallas I2C, si ya definiste los tamaños arriba, 
  // solo necesitas llamar a .init() y .backlight() dentro de void setup()
  return `  ${lcdName}.init();\n  ${lcdName}.backlight();\n`;
};
// --- 1. INCLUDE DE LA LIBRERÍA SERVO ---
ArduinoGenerator.forBlock['includeServo'] = (block, generator) => {
  const includeCode = '#include <Servo.h>\n';
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  return ''; // No escribe nada en las funciones setup/loop
};

// --- 2. CONFIGURACIÓN DEL OBJETO SERVO GLOBAL ---
ArduinoGenerator.forBlock['newServo'] = (block, generator) => {
  let servoName = generator.valueToCode(block, 'servoname', ArduinoGenerator.ORDER_ATOMIC) || 'myservo';
  servoName = servoName.replace(/['"]+/g, ''); // Limpiar comillas
  
  const instance = `Servo ${servoName};\n`;
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return ''; // No escribe nada en las funciones setup/loop
};

// --- 3. VINCULACIÓN AL PIN (ATTACH) ---
ArduinoGenerator.forBlock['attachServo'] = (block, generator) => {
  let servoName = generator.valueToCode(block, 'servoname', ArduinoGenerator.ORDER_ATOMIC) || 'myservo';
  servoName = servoName.replace(/['"]+/g, '');
  
  // Extraer pin del dropdown y limpiar la 'P'
  const pin = block.getFieldValue('pin').replace('P', '');
  
  // Retorna código directo porque está diseñado para vivir dentro de void setup()
  return `  ${servoName}.attach(${pin});\n`;
};

// --- 4. ACCIÓN MUEVE ÁNGULO (WRITE) ---
ArduinoGenerator.forBlock['writeServo'] = (block, generator) => {
  let servoName = generator.valueToCode(block, 'servoname', ArduinoGenerator.ORDER_ATOMIC) || 'myservo';
  servoName = servoName.replace(/['"]+/g, '');
  
  // Extraer el ángulo (puede ser un bloque numérico o una variable de mapeo de potenciómetro)
  const angle = generator.valueToCode(block, 'angle', ArduinoGenerator.ORDER_ATOMIC) || '90';
  
  // Retorna instrucción directa para ejecutarse en tiempo de ejecución (void loop)
  return `  ${servoName}.write(${angle});\n`;
};
// --- 5. ENVIAR PULSO PRECISO ( writeMicroseconds ) ---
ArduinoGenerator.forBlock['writeMicrosecondsServo'] = (block, generator) => {
  let servoName = generator.valueToCode(block, 'servoname', ArduinoGenerator.ORDER_ATOMIC) || 'myservo';
  servoName = servoName.replace(/['"]+/g, '');
  
  const us = generator.valueToCode(block, 'us', ArduinoGenerator.ORDER_ATOMIC) || '1500';
  
  return `  ${servoName}.writeMicroseconds(${us});\n`;
};

// --- 6. LEER ÁNGULO ACTUAL ( read ) -> RETORNA ARREGLO ---
ArduinoGenerator.forBlock['readServo'] = (block, generator) => {
  let servoName = generator.valueToCode(block, 'servoname', ArduinoGenerator.ORDER_ATOMIC) || 'myservo';
  servoName = servoName.replace(/['"]+/g, '');
  
  // Estructura de código C++ que se inyectará dentro de una operación o variable
  const code = `${servoName}.read()`;
  
  // 🔴 CRÍTICO: Los bloques reporteros de valor deben devolver un array con su precedencia
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 7. APAGAR TORQUE ( detach ) ---
ArduinoGenerator.forBlock['detachServo'] = (block, generator) => {
  let servoName = generator.valueToCode(block, 'servoname', ArduinoGenerator.ORDER_ATOMIC) || 'myservo';
  servoName = servoName.replace(/['"]+/g, '');
  
  return `  ${servoName}.detach();\n`;
};
// --- 1. INCLUDE DE LA LIBRERÍA NEOPIXEL ---
ArduinoGenerator.forBlock['includeNeoPixel'] = (block, generator) => {
  const includeCode = '#include <Adafruit_NeoPixel.h>\n';
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  return '';
};

// --- 2. CONFIGURACIÓN GLOBAL DE LA TIRA ---
ArduinoGenerator.forBlock['newNeoPixel'] = (block, generator) => {
  let stripName = generator.valueToCode(block, 'stripname', ArduinoGenerator.ORDER_ATOMIC) || 'strip';
  stripName = stripName.replace(/['"]+/g, ''); // Limpiar comillas
  
  const numLeds = generator.valueToCode(block, 'numleds', ArduinoGenerator.ORDER_ATOMIC) || '8';
  const pin = block.getFieldValue('pin').replace('P', '');

  // Sintaxis estándar de instanciación para tiras WS2812B a 800KHZ
  const instance = `Adafruit_NeoPixel ${stripName}(${numLeds}, ${pin}, NEO_GRB + NEO_KHZ800);\n`;
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return '';
};

// --- 3. INICIALIZACIÓN ( pixels.begin() ) ---
ArduinoGenerator.forBlock['initNeoPixel'] = (block, generator) => {
  let stripName = generator.valueToCode(block, 'stripname', ArduinoGenerator.ORDER_ATOMIC) || 'strip';
  stripName = stripName.replace(/['"]+/g, '');
  
  return `  ${stripName}.begin();\n`;
};

// --- 4. ASIGNAR COLOR INDIVIDUAL ( pixels.setPixelColor() ) ---
ArduinoGenerator.forBlock['setNeoPixelColor'] = (block, generator) => {
  let stripName = generator.valueToCode(block, 'stripname', ArduinoGenerator.ORDER_ATOMIC) || 'strip';
  stripName = stripName.replace(/['"]+/g, '');
  
  const ledIndex = generator.valueToCode(block, 'ledindex', ArduinoGenerator.ORDER_ATOMIC) || '0';
  
  // 🟢 Convertir Hexadecimal ("#ffaa00") a enteros RGB independientes para C++
  const hexColor = block.getFieldValue('color') || '#000000';
  const r = parseInt(hexColor.substring(1, 3), 16) || 0;
  const g = parseInt(hexColor.substring(3, 5), 16) || 0;
  const b = parseInt(hexColor.substring(5, 7), 16) || 0;
  
  return `  ${stripName}.setPixelColor(${ledIndex}, ${stripName}.Color(${r}, ${g}, ${b}));\n`;
};

// --- 5. ACTUALIZAR HARDWARE ( pixels.show() ) ---
ArduinoGenerator.forBlock['showNeoPixel'] = (block, generator) => {
  let stripName = generator.valueToCode(block, 'stripname', ArduinoGenerator.ORDER_ATOMIC) || 'strip';
  stripName = stripName.replace(/['"]+/g, '');
  
  return `  ${stripName}.show();\n`;
};
// --- 6. COMANDO CLEAR ( pixels.clear() ) ---
ArduinoGenerator.forBlock['clearNeoPixel'] = (block, generator) => {
  let stripName = generator.valueToCode(block, 'stripname', ArduinoGenerator.ORDER_ATOMIC) || 'strip';
  stripName = stripName.replace(/['"]+/g, '');
  
  return `  ${stripName}.clear();\n`;
};

// --- 7. CONFIGURAR BRILLO GLOBAL ( pixels.setBrightness() ) ---
ArduinoGenerator.forBlock['setBrightnessNeoPixel'] = (block, generator) => {
  let stripName = generator.valueToCode(block, 'stripname', ArduinoGenerator.ORDER_ATOMIC) || 'strip';
  stripName = stripName.replace(/['"]+/g, '');
  
  const brightness = generator.valueToCode(block, 'brightness', ArduinoGenerator.ORDER_ATOMIC) || '255';
  
  return `  ${stripName}.setBrightness(${brightness});\n`;
};

// --- 8. LEER CANTIDAD TOTAL DE LEDS ( pixels.numPixels() ) -> RETORNA ARREGLO ---
ArduinoGenerator.forBlock['numPixelsNeoPixel'] = (block, generator) => {
  let stripName = generator.valueToCode(block, 'stripname', ArduinoGenerator.ORDER_ATOMIC) || 'strip';
  stripName = stripName.replace(/['"]+/g, '');
  
  const code = `${stripName}.numPixels()`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 9. LEER COLOR ACTUAL DE UN LED ( pixels.getPixelColor() ) -> RETORNA ARREGLO ---
ArduinoGenerator.forBlock['getPixelColorNeoPixel'] = (block, generator) => {
  let stripName = generator.valueToCode(block, 'stripname', ArduinoGenerator.ORDER_ATOMIC) || 'strip';
  stripName = stripName.replace(/['"]+/g, '');
  
  const ledIndex = generator.valueToCode(block, 'ledindex', ArduinoGenerator.ORDER_ATOMIC) || '0';
  
  const code = `${stripName}.getPixelColor(${ledIndex})`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};
ArduinoGenerator.forBlock['includeAdafruitSensor'] = (block) => {
  const includeCode = '#include <Adafruit_Sensor.h>\n';
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  
  // 🟢 Buscar todos los bloques de la librería DHT para limpiar sus advertencias de inmediato
  const dhtBlocks = [
    ...block.workspace.getBlocksByType('newDhtSensor'),
    ...block.workspace.getBlocksByType('initDhtSensor'),
    ...block.workspace.getBlocksByType('readDhtTemperature'),
    ...block.workspace.getBlocksByType('readDhtHumidity')
  ];
  dhtBlocks.forEach(b => b.setWarningText(null));
  
  return ''; 
};
// --- HELPER DE VALIDACIÓN DE DEPENDENCIAS ---
const checkAdafruitSensorDependency = (block) => {
  const allBlocks = block.workspace.getAllBlocks(false);
  const hasBaseSensor = allBlocks.some(b => b.type === 'includeAdafruitSensor');
  const sensorLib = '#include <Adafruit_Sensor.h>\n';

  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];

  if (!hasBaseSensor) {
    // 🟡 Si no está el bloque en el lienzo, muestra la alerta visual en el bloque actual
    block.setWarningText('Warning: It is recommended to add the "Include this library" of Adafruit_Sensor category to use this block.');
    
    // 🛡️ Inyección de respaldo por seguridad para que compile de todos modos
    if (!ArduinoGenerator.definitionsLines.includes(sensorLib)) {
      ArduinoGenerator.definitionsLines.push(sensorLib);
    }
  } else {
    // 🟢 Si el bloque ya existe en el espacio de trabajo, removemos la advertencia visual
    block.setWarningText(null);
  }
};

// --- 1. INCLUDE DE LA LIBRERÍA DHT ---
ArduinoGenerator.forBlock['includeDHT'] = (block, generator) => {
  checkAdafruitSensorDependency(block);
  const dhtLib = '#include <DHT.h>\n';
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(dhtLib)) {
    ArduinoGenerator.definitionsLines.push(dhtLib);
  }
  return '';
};

// --- 2. CONFIGURACIÓN GLOBAL DEL SENSOR DHT ---
ArduinoGenerator.forBlock['newDhtSensor'] = (block, generator) => {
  // 🔍 Ejecutar validación cruzada
  checkAdafruitSensorDependency(block);

  let dhtName = generator.valueToCode(block, 'dhtname', ArduinoGenerator.ORDER_ATOMIC) || 'dht';
  dhtName = dhtName.replace(/['"]+/g, ''); 
  
  const pin = block.getFieldValue('pin').replace('P', '');
  const type = block.getFieldValue('type') || 'DHT11';

  const instance = `DHT ${dhtName}(${pin}, ${type});\n`;
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return '';
};

// --- 3. INICIALIZACIÓN ---
ArduinoGenerator.forBlock['initDhtSensor'] = (block, generator) => {
  checkAdafruitSensorDependency(block);
  
  let dhtName = generator.valueToCode(block, 'dhtname', ArduinoGenerator.ORDER_ATOMIC) || 'dht';
  dhtName = dhtName.replace(/['"]+/g, '');
  return `  ${dhtName}.begin();\n`;
};

// --- 4. REPORTERO: LECTURA DE TEMPERATURA ---
ArduinoGenerator.forBlock['readDhtTemperature'] = (block, generator) => {
  checkAdafruitSensorDependency(block);

  let dhtName = generator.valueToCode(block, 'dhtname', ArduinoGenerator.ORDER_ATOMIC) || 'dht';
  dhtName = dhtName.replace(/['"]+/g, ''); 
  
  const scale = block.getFieldValue('scale') || 'C';
  const param = (scale === 'F') ? 'true' : '';
  const code = `${dhtName}.readTemperature(${param})`;
  
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 5. REPORTERO: LECTURA DE HUMEDAD ---
ArduinoGenerator.forBlock['readDhtHumidity'] = (block, generator) => {
  checkAdafruitSensorDependency(block);

  let dhtName = generator.valueToCode(block, 'dhtname', ArduinoGenerator.ORDER_ATOMIC) || 'dht';
  dhtName = dhtName.replace(/['"]+/g, ''); 
  
  const code = `${dhtName}.readHumidity()`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};
// --- 1. INCLUDE DE LA LIBRERÍA ---
ArduinoGenerator.forBlock['includeAdafruitLCD'] = (block, generator) => {
  checkLcdI2cDependency(block)
  const includeCode = '#include <Adafruit_LiquidCrystal.h>\n';
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  return '';
};

// --- 2. CONFIGURACIÓN GLOBAL DE LA PANTALLA ---
ArduinoGenerator.forBlock['newAdafruitLcdScreen'] = (block, generator) => {
  checkLcdI2cDependency(block)
  // Extraer la dirección del dropdown
  const address = block.getFieldValue('address') || '0';

  // Extraer el nombre de la variable y limpiar comillas
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, '');
  
  // Guardamos las columnas y filas como atributos en el bloque para que el init posterior pueda leerlos si lo necesita,
  // pero el constructor de Adafruit solo necesita el índice i2c/dirección:
  const instance = `Adafruit_LiquidCrystal ${lcdName}(${address});\n`;
  
  // Guardamos las dimensiones en metadatos del bloque por si se requiere persistencia en la inicialización
  block.metaCols = generator.valueToCode(block, 'cols', ArduinoGenerator.ORDER_ATOMIC) || '16';
  block.metaRows = generator.valueToCode(block, 'rows', ArduinoGenerator.ORDER_ATOMIC) || '2';

  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return ''; 
};

// --- 3. INICIALIZACIÓN EN SETUP ( .begin() ) ---
ArduinoGenerator.forBlock['initAdafruitLcdScreen'] = (block, generator) => {
  checkLcdI2cDependency(block)
  let lcdName = generator.valueToCode(block, 'lcdname', ArduinoGenerator.ORDER_ATOMIC) || 'lcd';
  lcdName = lcdName.replace(/['"]+/g, '');
  
  // Buscamos si existe el bloque de configuración en el workspace para heredar sus cols y rows
  const allBlocks = block.workspace.getAllBlocks(false);
  const configBlock = allBlocks.find(b => b.type === 'newAdafruitLcdScreen');
  
  const cols = configBlock ? configBlock.metaCols : '16';
  const rows = configBlock ? configBlock.metaRows : '2';
  
  return `  ${lcdName}.begin(${cols}, ${rows});\n`;
};
// --- 1. INCLUDE DE LA LIBRERÍA HCSR04 ---
ArduinoGenerator.forBlock['includeUltrasonic'] = (block, generator) => {
  const includeCode = '#include <HCSR04.h>\n';
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  return '';
};

// --- 2. CONFIGURACIÓN GLOBAL DEL OBJETO SENSOR ---
ArduinoGenerator.forBlock['newUltrasonicSensor'] = (block, generator) => {
  let sensorName = generator.valueToCode(block, 'sensorname', ArduinoGenerator.ORDER_ATOMIC) || 'distanceSensor';
  sensorName = sensorName.replace(/['"]+/g, ''); // Limpiar comillas
  
  const triggerPin = block.getFieldValue('trigger').replace('P', '');
  const echoPin = block.getFieldValue('echo').replace('P', '');

  // Sintaxis nativa de la librería: UltraSonicDistanceSensor name(trigger, echo);
  const instance = `UltraSonicDistanceSensor ${sensorName}(${triggerPin}, ${echoPin});\n`;
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return ''; // No escribe nada en setup ni loop
};

// --- 3. REPORTERO: LECTURA DE DISTANCIA -> RETORNA ARREGLO ---
// --- REPORTERO: LECTURA DE DISTANCIA CON UNIDAD VARIABLE -> RETORNA ARREGLO ---
ArduinoGenerator.forBlock['readUltrasonicDistance'] = (block, generator) => {
  let sensorName = generator.valueToCode(block, 'sensorname', ArduinoGenerator.ORDER_ATOMIC) || 'distanceSensor';
  sensorName = sensorName.replace(/['"]+/g, ''); // Limpiar comillas del nombre de la variable
  
  // 🟢 Extraer la unidad seleccionada ("CM" o "INCHES")
  const unit = block.getFieldValue('unit') || 'CM';
  
  let code = `${sensorName}.measureDistanceCm()`;
  let order = ArduinoGenerator.ORDER_ATOMIC;

  // Si la unidad es pulgadas, aplicamos la fórmula matemática de conversión (cm / 2.54)
  if (unit === 'INCHES') {
    code = `(${code} / 2.54)`;
    order = ArduinoGenerator.ORDER_MULTIPLICATIVE; // Actualizamos la precedencia por la división
  }
  
  // Retornamos el código final estructurado junto con su nivel de precedencia correspondiente
  return [code, order];
};
// --- 1. INCLUDE DE LA LIBRERÍA ---
ArduinoGenerator.forBlock['includeSoftwareSerial'] = (block, generator) => {
  const includeCode = '#include <SoftwareSerial.h>\n';
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(includeCode)) {
    ArduinoGenerator.definitionsLines.push(includeCode);
  }
  return '';
};

// --- 2. CONFIGURACIÓN DEL PUERTO GLOBAL ---
ArduinoGenerator.forBlock['newSoftwareSerial'] = (block, generator) => {
  let serialName = generator.valueToCode(block, 'serialname', ArduinoGenerator.ORDER_ATOMIC) || 'mySerial';
  serialName = serialName.replace(/['"]+/g, ''); // Limpiar comillas
  
  const rxPin = block.getFieldValue('rx').replace('P', '');
  const txPin = block.getFieldValue('tx').replace('P', '');

  // Sintaxis nativa: SoftwareSerial name(RX, TX);
  const instance = `SoftwareSerial ${serialName}(${rxPin}, ${txPin});\n`;
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return '';
};

// --- 3. INICIALIZACIÓN EN SETUP ( .begin() ) ---
ArduinoGenerator.forBlock['beginSoftwareSerial'] = (block, generator) => {
  let serialName = generator.valueToCode(block, 'serialname', ArduinoGenerator.ORDER_ATOMIC) || 'mySerial';
  serialName = serialName.replace(/['"]+/g, '');
  
  const baudRate = block.getFieldValue('baud') || '9600';
  
  return `  ${serialName}.begin(${baudRate});\n`;
};

// --- 4. COMANDO ENVIAR / IMPRIMIR ---
ArduinoGenerator.forBlock['printSoftwareSerial'] = (block, generator) => {
  let serialName = generator.valueToCode(block, 'serialname', ArduinoGenerator.ORDER_ATOMIC) || 'mySerial';
  serialName = serialName.replace(/['"]+/g, '');
  
  const text = generator.valueToCode(block, 'textToPrint', ArduinoGenerator.ORDER_ATOMIC) || '""';
  const newline = block.getFieldValue('newline') === '1' ? 'ln' : '';
  
  return `  ${serialName}.print${newline}(${text});\n`;
};

// --- 5. REPORTERO: DISPONIBLES -> RETORNA ARREGLO ---
ArduinoGenerator.forBlock['availableSoftwareSerial'] = (block, generator) => {
  let serialName = generator.valueToCode(block, 'serialname', ArduinoGenerator.ORDER_ATOMIC) || 'mySerial';
  serialName = serialName.replace(/['"]+/g, '');
  
  const code = `${serialName}.available()`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 6. REPORTERO: LEER -> RETORNA ARREGLO ---
ArduinoGenerator.forBlock['readSoftwareSerial'] = (block, generator) => {
  let serialName = generator.valueToCode(block, 'serialname', ArduinoGenerator.ORDER_ATOMIC) || 'mySerial';
  serialName = serialName.replace(/['"]+/g, '');
  
  const code = `${serialName}.read()`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};
// --- 1. INCLUDE DE LAS LIBRERÍAS ---
ArduinoGenerator.forBlock['includeSSD1306'] = (block, generator) => {
  checkLcdI2cDependency(block)
  checkGFX(block)
  const oledLib = '#include <Adafruit_SSD1306.h>\n';
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(oledLib)) ArduinoGenerator.definitionsLines.push(oledLib);
  return '';
};
ArduinoGenerator.forBlock['includeAdafruitGFX'] = (block, generator) => {
  checkLcdI2cDependency(block)
  check1306(block)
  const oledLib = '#include <Adafruit_GFX.h>\n';
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(oledLib)) ArduinoGenerator.definitionsLines.push(oledLib);
  return '';
};

// --- 2. CONFIGURACIÓN GLOBAL DE LA PANTALLA ---
ArduinoGenerator.forBlock['newSSD1306Screen'] = (block, generator) => {
  checkLcdI2cDependency(block)
  checkGFX(block)
  check1306(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, ''); // Limpiar comillas
  
  const width = generator.valueToCode(block, 'width', ArduinoGenerator.ORDER_ATOMIC) || '128';
  const height = generator.valueToCode(block, 'height', ArduinoGenerator.ORDER_ATOMIC) || '64';
  const address = block.getFieldValue('address') || '0x3C';

  // Guardamos la dirección I2C en los metadatos del bloque para que el init pueda usarla
  block.metaOledAddress = address;

  // Sintaxis oficial: Adafruit_SSD1306 name(W, H, &Wire, -1); (-1 significa sin pin de RESET)
  const instance = `Adafruit_SSD1306 ${displayName}(${width}, ${height}, &Wire, -1);\n`;
  
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(instance)) {
    ArduinoGenerator.definitionsLines.push(instance);
  }
  return '';
};

// --- 3. INICIALIZACIÓN EN SETUP ( .begin() ) ---
ArduinoGenerator.forBlock['initSSD1306Screen'] = (block, generator) => {
  checkLcdI2cDependency(block)
  checkGFX(block)
  check1306(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  
  // Buscar el bloque configurador en el workspace para heredar la dirección hexadecimal correcta
  const allBlocks = block.workspace.getAllBlocks(false);
  const configBlock = allBlocks.find(b => b.type === 'newSSD1306Screen');
  const address = configBlock ? configBlock.metaOledAddress : '0x3C';
  
  // Código de inicialización estándar recomendado por Adafruit
  return `  if(!${displayName}.begin(SSD1306_SWITCHCAPVCC, ${address})) { \n    Serial.println(F("SSD1306 allocation failed"));\n    for(;;);\n  }\n  ${displayName}.display();\n  delay(2000);\n  ${displayName}.clearDisplay();\n`;
};

// --- 4. COMANDO CLEAR ( .clearDisplay() ) ---
ArduinoGenerator.forBlock['clearSSD1306'] = (block, generator) => {
  checkLcdI2cDependency(block)
  checkGFX(block)
  check1306(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  return `  ${displayName}.clearDisplay();\n`;
};

// --- 5. TEXT FORMAT ( Cursor, Size & Color ) ---
ArduinoGenerator.forBlock['setTextFormatSSD1306'] = (block, generator) => {
  checkLcdI2cDependency(block)
  checkGFX(block)
  check1306(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  
  const x = generator.valueToCode(block, 'x', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'y', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const size = generator.valueToCode(block, 'size', ArduinoGenerator.ORDER_ATOMIC) || '1';
  
  // Forzamos el color a SSD1306_WHITE (1) por defecto para que sea visible en pantallas monocromáticas
  return `  ${displayName}.setTextSize(${size});\n  ${displayName}.setTextColor(SSD1306_WHITE);\n  ${displayName}.setCursor(${x}, ${y});\n`;
};

// --- 6. COMANDO PRINT ( .print() ) ---
ArduinoGenerator.forBlock['printSSD1306'] = (block, generator) => {
  checkLcdI2cDependency(block)
  checkGFX(block)
  check1306(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  
  const value = generator.valueToCode(block, 'value', ArduinoGenerator.ORDER_ATOMIC) || '""';
  return `  ${displayName}.print(${value});\n`;
};

// --- 7. COMANDO UPDATE HARDWARE ( .display() ) ---
ArduinoGenerator.forBlock['showSSD1306'] = (block, generator) => {
  checkLcdI2cDependency(block)
  checkGFX(block)
  check1306(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  return `  ${displayName}.display();\n`;
};
// --- 1. DIBUJAR LÍNEA ---
ArduinoGenerator.forBlock['gfxDrawLine'] = (block, generator) => {
  checkGFX(block)
  check1306(block)
  checkLcdI2cDependency(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  
  const x0 = generator.valueToCode(block, 'x0', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const y0 = generator.valueToCode(block, 'y0', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const x1 = generator.valueToCode(block, 'x1', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'y1', ArduinoGenerator.ORDER_ATOMIC) || '0';
  
  return `  ${displayName}.drawLine(${x0}, ${y0}, ${x1}, ${y1}, SSD1306_WHITE);\n`;
};

// --- 2. DIBUJAR RECTÁNGULO ---
ArduinoGenerator.forBlock['gfxDrawRect'] = (block, generator) => {
  checkGFX(block)
  check1306(block)
  checkLcdI2cDependency(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  
  const x = generator.valueToCode(block, 'x', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'y', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'w', ArduinoGenerator.ORDER_ATOMIC) || '10';
  const h = generator.valueToCode(block, 'h', ArduinoGenerator.ORDER_ATOMIC) || '10';
  const mode = block.getFieldValue('mode') || 'drawRect';
  
  return `  ${displayName}.${mode}(${x}, ${y}, ${w}, ${h}, SSD1306_WHITE);\n`;
};

// --- 3. DIBUJAR CÍRCULO ---
ArduinoGenerator.forBlock['gfxDrawCircle'] = (block, generator) => {
  checkGFX(block)
  check1306(block)
  checkLcdI2cDependency(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  
  const x = generator.valueToCode(block, 'x', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'y', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const r = generator.valueToCode(block, 'r', ArduinoGenerator.ORDER_ATOMIC) || '5';
  const mode = block.getFieldValue('mode') || 'drawCircle';
  
  return `  ${displayName}.${mode}(${x}, ${y}, ${r}, SSD1306_WHITE);\n`;
};

// --- 4. DIBUJAR RECTÁNGULO REDONDEADO ---
ArduinoGenerator.forBlock['gfxDrawRoundRect'] = (block, generator) => {
  checkGFX(block)
  check1306(block)
  checkLcdI2cDependency(block)
  let displayName = generator.valueToCode(block, 'displayname', ArduinoGenerator.ORDER_ATOMIC) || 'display';
  displayName = displayName.replace(/['"]+/g, '');
  
  const x = generator.valueToCode(block, 'x', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'y', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'w', ArduinoGenerator.ORDER_ATOMIC) || '20';
  const h = generator.valueToCode(block, 'h', ArduinoGenerator.ORDER_ATOMIC) || '10';
  const r = generator.valueToCode(block, 'r', ArduinoGenerator.ORDER_ATOMIC) || '3';
  const mode = block.getFieldValue('mode') || 'drawRoundRect';
  
  return `  ${displayName}.${mode}(${x}, ${y}, ${w}, ${h}, ${r}, SSD1306_WHITE);\n`;
};
const check1306 = (block) => {
  const allBlocks = block.workspace.getAllBlocks(false);
  const hasBaseSensor = allBlocks.some(b => b.type === 'includeSSD1306');
  const sensorLib = '#include <Adafruit_SSD1306.h>\n';

  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];

  if (!hasBaseSensor) {
    // 🟡 Si no está el bloque en el lienzo, muestra la alerta visual en el bloque actual
    block.setWarningText('Warning: It is recommended to add the "Include this library" of OLED SSD1306 category to use this block.');
    
    // 🛡️ Inyección de respaldo por seguridad para que compile de todos modos
    if (!ArduinoGenerator.definitionsLines.includes(sensorLib)) {
      ArduinoGenerator.definitionsLines.push(sensorLib);
    }
  } else {
    // 🟢 Si el bloque ya existe en el espacio de trabajo, removemos la advertencia visual
    block.setWarningText(null);
  }
};
const checkGFX = (block) => {
  const allBlocks = block.workspace.getAllBlocks(false);
  const hasBaseSensor = allBlocks.some(b => b.type === 'includeAdafruitGFX');
  const sensorLib = '#include <Adafruit_GFX.h>\n';

  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];

  if (!hasBaseSensor) {
    // 🟡 Si no está el bloque en el lienzo, muestra la alerta visual en el bloque actual
    block.setWarningText('Warning: It is recommended to add the "Include this library" of Adafruit_GFX (Draw) category to use this block.');
    
    // 🛡️ Inyección de respaldo por seguridad para que compile de todos modos
    if (!ArduinoGenerator.definitionsLines.includes(sensorLib)) {
      ArduinoGenerator.definitionsLines.push(sensorLib);
    }
  } else {
    // 🟢 Si el bloque ya existe en el espacio de trabajo, removemos la advertencia visual
    block.setWarningText(null);
  }
};
// --- 1. CREACIÓN DE LA MACRO GLOBAL (#define) ---
ArduinoGenerator.forBlock['createDefineConstant'] = (block, generator) => {
  // Extraer el nombre de la constante y limpiar comillas
  let name = generator.valueToCode(block, 'macroName', ArduinoGenerator.ORDER_ATOMIC) || 'CONSTANT_NAME';
  name = name.replace(/['"]+/g, '');
  
  // Extraer el valor (puede ser un número block o texto)
  const value = generator.valueToCode(block, 'macroValue', ArduinoGenerator.ORDER_ATOMIC) || '0';
  
  // Estructura nativa: #define NOMBRE valor
  const defineLine = `#define ${name} ${value}\n`;
  
  // Inyectar de forma segura en la sección externa superior del archivo .ino
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(defineLine)) {
    ArduinoGenerator.definitionsLines.push(defineLine);
  }
  
  // Retorna vacío para asegurar que no ensucie la función void setup()
  return '';
};

// --- 2. REPORTERO DE CONSTANTE -> RETORNA ARREGLO ---
ArduinoGenerator.forBlock['getDefineConstant'] = (block, generator) => {
  let name = generator.valueToCode(block, 'macroName', ArduinoGenerator.ORDER_ATOMIC) || 'CONSTANT_NAME';
  name = name.replace(/['"]+/g, '');
  
  // Retornamos simplemente el nombre de la variable de preprocesamiento
  return [name, ArduinoGenerator.ORDER_ATOMIC];
};
// --- 1. DECLARACIÓN DE VARIABLE GLOBAL ---
// --- DECLARACIÓN DE VARIABLE GLOBAL ACTUALIZADA CON BYTE ---
ArduinoGenerator.forBlock['declareGlobalVar'] = (block, generator) => {
  const type = block.getFieldValue('varType') || 'int';
  
  let name = generator.valueToCode(block, 'varName', ArduinoGenerator.ORDER_ATOMIC) || 'myVariable';
  name = name.replace(/['"]+/g, ''); // Limpiar comillas del identificador
  
  let value = generator.valueToCode(block, 'varValue', ArduinoGenerator.ORDER_ATOMIC);
  
  // Establecer fallbacks inteligentes de inicialización en C++ incluyendo el tipo byte
  if (!value) {
    if (type === 'int' || type === 'unsigned int' || type === 'unsigned long' || type === 'byte' || type === 'float') {
      value = '0';
    }
    if (type === 'bool') value = 'false';
    if (type === 'String') value = '""';
  }

  // Estructura nativa: tipo nombre = valor;
  const declarationLine = `${type} ${name} = ${value};\n`;
  
  // Inyectar en la cima del archivo mediante nuestro acumulador global del Header
  ArduinoGenerator.definitionsLines = ArduinoGenerator.definitionsLines || [];
  if (!ArduinoGenerator.definitionsLines.includes(declarationLine)) {
    ArduinoGenerator.definitionsLines.push(declarationLine);
  }
  
  return ''; // No ensucia el void setup()
};

// --- 2. MODIFICACIÓN / ASIGNACIÓN DE VARIABLE ---
ArduinoGenerator.forBlock['setGlobalVar'] = (block, generator) => {
  let name = generator.valueToCode(block, 'varName', ArduinoGenerator.ORDER_ATOMIC) || 'myVariable';
  name = name.replace(/['"]+/g, '');
  
  const newValue = generator.valueToCode(block, 'newValue', ArduinoGenerator.ORDER_ATOMIC) || '0';
  
  // Retorna una instrucción de asignación estándar para ejecutarse en setup o loop
  return `  ${name} = ${newValue};\n`;
};

// --- 3. REPORTERO DE LECTURA DE VARIABLE -> RETORNA ARREGLO ---
ArduinoGenerator.forBlock['getGlobalVar'] = (block, generator) => {
  let name = generator.valueToCode(block, 'varName', ArduinoGenerator.ORDER_ATOMIC) || 'myVariable';
  name = name.replace(/['"]+/g, '');
  
  // Retorna el identificador puro para que el motor recursivo lo ensamble en fórmulas o condicionales
  return [name, ArduinoGenerator.ORDER_ATOMIC];
};
// Helper rápido para limpiar nombres de funciones
const cleanFuncName = (block, generator) => {
  let name = generator.valueToCode(block, 'funcName', ArduinoGenerator.ORDER_ATOMIC) || 'myFunction';
  return name.replace(/['"]+/g, '');
};

// --- 1. DEFINIR PROCEDIMIENTO CON ARGUMENTOS ---
ArduinoGenerator.forBlock['defineVoidFunc'] = (block, generator) => {
  const name = cleanFuncName(block, generator);
  
  // 🟢 Extraer la lista de argumentos de la caja de texto (ej: "int x, float y")
  const argsList = block.getFieldValue('argsList') || '';

  let currentBlock = block.getInputTargetBlock('runcode');
  let bodyCode = '';
  while (currentBlock) {
    const mappingFunc = ArduinoGenerator.forBlock[currentBlock.type];
    if (mappingFunc) {
      const lineCode = mappingFunc(currentBlock, generator);
      if (lineCode && typeof lineCode === 'string') bodyCode += lineCode;
    }
    currentBlock = currentBlock.getNextBlock();
  }

  // Estructura C++: void nombre(int x) { cuerpo }
  const definition = `void ${name}(${argsList}) {\n${bodyCode}}\n\n`;
  
  ArduinoGenerator.functionsLines = ArduinoGenerator.functionsLines || [];
  if (!ArduinoGenerator.functionsLines.includes(definition)) {
    ArduinoGenerator.functionsLines.push(definition);
  }
  return '';
};

// --- 2. LLAMAR PROCEDIMIENTO ENVIANDO PARÁMETROS ---
ArduinoGenerator.forBlock['callVoidFunc'] = (block, generator) => {
  const name = cleanFuncName(block, generator);
  
  // 🟢 Extraer el valor o variable que se envía (puede ser un número o texto)
  const argsSend = generator.valueToCode(block, 'argsSend', ArduinoGenerator.ORDER_ATOMIC) || '0';
  
  return `  ${name}(${argsSend});\n`;
};

// --- 3. DEFINIR FUNCIÓN DE VALOR CON ARGUMENTOS ---
ArduinoGenerator.forBlock['defineValueFunc'] = (block, generator) => {
  const name = cleanFuncName(block, generator);
  const type = block.getFieldValue('returnType') || 'int';
  const argsList = block.getFieldValue('argsList') || '';
  
  let currentBlock = block.getInputTargetBlock('runcode');
  let bodyCode = '';
  while (currentBlock) {
    const mappingFunc = ArduinoGenerator.forBlock[currentBlock.type];
    if (mappingFunc) {
      const lineCode = mappingFunc(currentBlock, generator);
      if (lineCode && typeof lineCode === 'string') bodyCode += lineCode;
    }
    currentBlock = currentBlock.getNextBlock();
  }

  const retValue = generator.valueToCode(block, 'returnValue', ArduinoGenerator.ORDER_ATOMIC) || '0';

  // Estructura C++: tipo nombre(int x) { cuerpo; return valor; }
  const definition = `${type} ${name}(${argsList}) {\n${bodyCode}  return ${retValue};\n}\n\n`;
  
  ArduinoGenerator.functionsLines = ArduinoGenerator.functionsLines || [];
  if (!ArduinoGenerator.functionsLines.includes(definition)) {
    ArduinoGenerator.functionsLines.push(definition);
  }
  return '';
};

// --- 4. LLAMAR FUNCIÓN DE VALOR ENVIANDO PARÁMETROS ---
ArduinoGenerator.forBlock['callValueFunc'] = (block, generator) => {
  const name = cleanFuncName(block, generator);
  const argsSend = generator.valueToCode(block, 'argsSend', ArduinoGenerator.ORDER_ATOMIC) || '0';
  
  const code = `${name}(${argsSend})`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};
// --- GENERADOR PARA EL BLOQUE DE COMENTARIOS ---
ArduinoGenerator.forBlock['arduinoComment'] = (block) => {
  // Extraer el texto escrito por el usuario en la caja
  const comment = block.getFieldValue('commentText') || '';
  
  // Retornar el formato de comentario nativo de C++
  return `  // ${comment}\n`;
};