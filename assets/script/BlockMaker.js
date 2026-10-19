// Block map
/*const map = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Test",
      colour: "#fcd305",
      contents: [
        {
          kind: "block",
          type: "console_log",
        },
      ],
    },
  ],
};*/
// Other block definitions
// Define a normal block that takes an input string and has top/bottom connections
function newBlock(type, message, args, color, toolTip, hlpUrl, useEvent, useVarReporter) {
  let obj = {
    type: type,
    message0: message, // Fix: Interpolates the actual message variable
    args0: args,
    previousStatement: null,
    nextStatement: null,
    colour: color,
    tooltip: toolTip,
    helpUrl: hlpUrl,
  }
  if(useEvent === true){
    delete obj.previousStatement
    delete obj.nextStatement
    obj.hat = "cap"
  }
  if(useVarReporter === true){
    obj.output = "Number"
  }
  Blockly.common.defineBlocksWithJsonArray([obj]);
}

