// Syntax: newBlock(type, message, args, color, toolTip, hlpUrl) {}
newBlock(
  "console_log",
  "print to console %1", // Removed the extra %1 since newBlock adds it automatically
  [
    {
      type: "input_value",
      name: "TEXT",
      check: "String", // Fixed: Added the missing colon here
    },
  ],
  160,
  "Prints the specified text to the developer console.",
  "",
);