const workspace = Blockly.inject("blocklyArea", {
  toolbox: map,
  scrollbars: true,
  trashcan: true,
  renderer: "zelos",
  theme: Blockly.Themes.Zelos,
  //theme: "modern",
  grid: {
    spacing: 25,
    length: 0,
    colour: "#ffffff",
    snap: true,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.1,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
});
(function() {
  const originalInit = Blockly.Blocks['controls_if'].init;
  
  Blockly.Blocks['controls_if'].init = function() {
    // Call the original layout rules
    originalInit.call(this);
    // Explicitly overwrite the color on instantiation
    this.setColour('#ffa600'); 
  };
})();
/*(function() {
  const originalInit = Blockly.Blocks['controls_if'].init;
  
  Blockly.Blocks['controls_if'].init = function() {
    // Call the original layout rules
    originalInit.call(this);
    // Explicitly overwrite the color on instantiation
    this.colourPrimary = '#ffa600';
    this.colourSecondary = '#ffa600';
    this.colourTertiary = '#ffa600';
  };
})();*/
(function() {
  const originalInit = Blockly.Blocks['logic_compare'].init;
  
  Blockly.Blocks['logic_compare'].init = function() {
    // Call the original layout rules
    originalInit.call(this);
    // Explicitly overwrite the color on instantiation
    this.setColour('#2bff00'); 
  };
})();
(function() {
  const originalInit = Blockly.Blocks['logic_operation'].init;
  
  Blockly.Blocks['logic_operation'].init = function() {
    // Call the original layout rules
    originalInit.call(this);
    // Explicitly overwrite the color on instantiation
    this.setColour('#2bff00'); 
  };
})();
(function() {
  const originalInit = Blockly.Blocks['logic_negate'].init;
  
  Blockly.Blocks['logic_negate'].init = function() {
    // Call the original layout rules
    originalInit.call(this);
    // Explicitly overwrite the color on instantiation
    this.setColour('#2bff00'); 
  };
})();
// 1. Direct Object Hack: Intercept the global Zelos logic styles directly
// This works perfectly on any cdnjs version with the Zelos renderer!
if (Blockly.Themes && Blockly.Themes.Zelos && Blockly.Themes.Zelos.blockStyles) {
  Blockly.Themes.Zelos.blockStyles['logic_blocks'] = {
    'colourPrimary': '#ffa600' // Your exact desired color here
  };
}

// 2. Define your toolbox normally
const toolboxJson = {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'Logic',
      'contents': [
        { 'kind': 'block', 'type': 'controls_if' }
      ]
    }
  ]
};