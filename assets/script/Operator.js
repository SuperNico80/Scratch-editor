// --- 1. BLOQUE DE NÚMEROS (math_number) ---
ArduinoGenerator.forBlock['math_number'] = (block, generator) => {
  const code = String(block.getFieldValue('NUM') || '0');
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 2. CADENAS DE TEXTO NATIVAS (text) ---
ArduinoGenerator.forBlock['text'] = (block, generator) => {
  const code = JSON.stringify(block.getFieldValue('TEXT') || '');
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 3. OPERACIONES ARITMÉTICAS (math_arithmetic: +, -, *, /, ^) ---
ArduinoGenerator.forBlock['math_arithmetic'] = (block, generator) => {
  const OPERATORS = {
    'ADD': [' + ', ArduinoGenerator.ORDER_ADDITIVE],
    'MINUS': [' - ', ArduinoGenerator.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', ArduinoGenerator.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', ArduinoGenerator.ORDER_MULTIPLICATIVE],
    'POWER': [null, ArduinoGenerator.ORDER_NONE]
  };
  
  const tuple = OPERATORS[block.getFieldValue('OP')];
  const operator = tuple[0];
  const order = tuple[1];
  
  if (!operator) { // Si el usuario seleccionó potencia (^), usamos pow() de C++
    const base = generator.valueToCode(block, 'A', ArduinoGenerator.ORDER_ATOMIC) || '0';
    const exp = generator.valueToCode(block, 'B', ArduinoGenerator.ORDER_ATOMIC) || '0';
    return [`pow(${base}, ${exp})`, ArduinoGenerator.ORDER_ATOMIC];
  }
  
  const argument0 = generator.valueToCode(block, 'A', order) || '0';
  const argument1 = generator.valueToCode(block, 'B', order) || '0';
  const code = argument0 + operator + argument1;
  return [code, order];
};

// --- 4. COMPARACIONES LÓGICAS (logic_compare: ==, !=, <, >, <=, >=) ---
ArduinoGenerator.forBlock['logic_compare'] = (block, generator) => {
  const OPERATORS = {
    'EQ': '==', 'NEQ': '!=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>='
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const order = (operator === '==' || operator === '!=') ? 
                 ArduinoGenerator.ORDER_EQUALITY : ArduinoGenerator.ORDER_RELATIONAL;
                 
  const argument0 = generator.valueToCode(block, 'A', order) || '0';
  const argument1 = generator.valueToCode(block, 'B', order) || '0';
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

// --- 5. NÚMERO ALEATORIO (math_random_int) ---
ArduinoGenerator.forBlock['math_random_int'] = (block, generator) => {
  const low = generator.valueToCode(block, 'FROM', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const high = generator.valueToCode(block, 'TO', ArduinoGenerator.ORDER_ATOMIC) || '100';
  const code = `random(${low}, ${high} + 1)`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 6. OPERACIONES BOOLEANAS (logic_operation: AND, OR) ---
ArduinoGenerator.forBlock['logic_operation'] = (block, generator) => {
  const operator = (block.getFieldValue('OP') === 'AND') ? '&&' : '||';
  const order = (operator === '&&') ? ArduinoGenerator.ORDER_LOGICAL_AND : ArduinoGenerator.ORDER_LOGICAL_OR;
  
  const argument0 = generator.valueToCode(block, 'A', order) || 'false';
  const argument1 = generator.valueToCode(block, 'B', order) || 'false';
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

// --- 7. NEGACIÓN (logic_negate: NOT) ---
ArduinoGenerator.forBlock['logic_negate'] = (block, generator) => {
  const order = ArduinoGenerator.ORDER_UNARY;
  const argument0 = generator.valueToCode(block, 'BOOL', order) || 'false';
  const code = '!' + argument0;
  return [code, order];
};

// --- 8. OPERACIONES MATEMÁTICAS AVANZADAS (math_single: Raíz, Absoluto, etc.) ---
ArduinoGenerator.forBlock['math_single'] = (block, generator) => {
  const mode = block.getFieldValue('OP');
  const num = generator.valueToCode(block, 'NUM', ArduinoGenerator.ORDER_ATOMIC) || '0';
  let code = '';
  
  switch (mode) {
    case 'ROOT': code = `sqrt(${num})`; break;
    case 'ABS':  code = `abs(${num})`; break;
    case 'LN':   code = `log(${num})`; break;
    case 'LOG10':code = `log10(${num})`; break;
    case 'EXP':  code = `exp(${num})`; break;
    case 'POW10':code = `pow(10, ${num})`; break;
    default:     code = num;
  }
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 9. TU BLOQUE PERSONALIZADO: math_map_range ---
ArduinoGenerator.forBlock['math_map_range'] = (block, generator) => {
  const val = generator.valueToCode(block, 'VALUE', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const fLow = generator.valueToCode(block, 'FROM_LOW', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const fHigh = generator.valueToCode(block, 'FROM_HIGH', ArduinoGenerator.ORDER_ATOMIC) || '1023';
  const tLow = generator.valueToCode(block, 'TO_LOW', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const tHigh = generator.valueToCode(block, 'TO_HIGH', ArduinoGenerator.ORDER_ATOMIC) || '255';
  
  const code = `map(${val}, ${fLow}, ${fHigh}, ${tLow}, ${tHigh})`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};

// --- 10. TU BLOQUE PERSONALIZADO: math_constrain_range ---
ArduinoGenerator.forBlock['math_constrain_range'] = (block, generator) => {
  const val = generator.valueToCode(block, 'VALUE', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const low = generator.valueToCode(block, 'TO_LOW', ArduinoGenerator.ORDER_ATOMIC) || '0';
  const high = generator.valueToCode(block, 'TO_HIGH', ArduinoGenerator.ORDER_ATOMIC) || '255';
  
  const code = `constrain(${val}, ${low}, ${high})`;
  return [code, ArduinoGenerator.ORDER_ATOMIC];
};