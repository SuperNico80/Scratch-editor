function blocklyFullScreen() {
  const targetContainer = document.getElementById("blocklyArea");

  if (!document.fullscreenElement) {
      // If not in fullscreen, enter fullscreen mode
      targetContainer
        .requestFullscreen()
        .then(() => {
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`,
          );
        });
    } else {
      // If already in fullscreen, exit it
      document.exitFullscreen();
    }
}

console.log(Object.keys(window).filter(
  k => k.toLowerCase().includes("colour") ||
       k.toLowerCase().includes("color")
));
if (typeof registerFieldColour === "function") {
  registerFieldColour();
} else {
  console.error(
    "No se ha cargado el complemento FieldColour."
  );
}
// 1. Safe detection for UNPKG bundle attachment points
const colourPlugin = window.BlocklyFieldColour || Blockly.FieldColour;

if (colourPlugin && typeof colourPlugin.installAllBlocks === 'function') {
    // 2. Register "colour_picker" and other core color blocks safely
    colourPlugin.installAllBlocks(Blockly.common.getBlocksByLanguage());
} else {
    console.error("Blockly Field Colour plugin could not be resolved from global scope.");
}
async function copyCode() {
    // 1. Target the <pre> element
    const preElement = document.getElementById('codeOutputBox');
    
    // 2. Extract its text content
    const textToCopy = preElement.innerText;

    try {
        // 3. Write the text directly to the user's clipboard via Clipboard API
        await navigator.clipboard.writeText(textToCopy);
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
};