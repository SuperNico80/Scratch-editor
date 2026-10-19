// Block map
const map = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Basic",
      colour: "#0091ff",
      contents: [
        {
            kind: "block",
            type: "definePin"
        },
        {
            kind: "block",
            type: "definePinToVar"
        },
        {
            kind: "block",
            type: "defineLed"
        },
        {
            kind: "block",
            type: "playSpkr"
        },
        {
            kind: "block",
            type: "stopSpkr"
        },
        {
            kind: "block",
            type: "serialPrnt"
        },
        {
            kind: "block",
            type: "pinMode"
        },
        {
            kind: "block",
            type: "serialBegin"
        }
      ]
    },
    {
        kind: "category",
        name: "Events",
        colour: "#ffdd00",
        contents: [
            {
                kind: "block",
                type: "onStart"
            },
            {
                kind: "block",
                type: "forever"
            }
        ]
    },
    {
        kind: "category",
        name: "Control",
        colour: "#ffa600",
        contents: [
            {
                kind: "block",
                type: "wait"
            },
            {
                kind: "block",
                type: "repeat"
            },
            {
                kind: "block",
                type: "repeatwhile"
            },
            {
                kind: "block",
                type: "controls_if"
            },
        ]
    },
    {
        kind: "category",
        name: "Operators And Math",
        colour: "#2bff00",
        contents: [
            { "kind": "block", "type": "math_number" },
            { "kind": "block", "type": "text" },
            { "kind": "block", "type": "math_arithmetic" },
            { "kind": "block", "type": "logic_compare" },
            { "kind": "block", "type": "math_random_int"},
            { "kind": "block", "type": "logic_operation" },
            { "kind": "block", "type": "logic_negate" },
            { "kind": "block", "type": "math_single" },
            {
                kind: "block",
                type: "math_map_range"
            },
            //math_constrain_range
            {
                kind: "block",
                type: "math_constrain_range"
            }
        ]
    },
    {
        kind: "category",
        name: "Input",
        colour: "#d000ff",
        contents: [
            {
                kind: "block",
                type: "readdigital"
            },
            {
                kind: "block",
                type: "readanalog"
            },
            {
                kind: "block",
                type: "serialnum"
            },
            {
                kind: "block",
                type: "serialread"
            },
            {
                kind: "block",
                type: "tempread"
            },
            {
                kind: "block",
                type: "infaread"
            }
        ]
    },
    {
        kind: "category",
        name: "LiquidCrystal",
        colour: "#00ff66",
        contents: [
            {
                kind: "block",
                type: "newLcd4Screen"
            },
            {
                kind: "block",
                type: "newLcd8Screen"
            },
            {
                kind: "block",
                type: "includeLiquidCrystal"
            }
        ]
    }
  ],
};
