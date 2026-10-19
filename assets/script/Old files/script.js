"use strict";

/* =========================================================
   CONFIG
========================================================= */

const SVG_ROOT = "../assets/img/svg/blocks/";
const SNAP_SIZE = 16;
const SNAP_DISTANCE = 24;
const BLOCK_GAP = 0;


/* =========================================================
   STATE
========================================================= */

const state = {

    languages: {

        html: {

            id: "html",
            name: "HTML",

            categories: {

                headers: {

                    id: "headers",
                    name: "Headers",
                    color: "#E44D26",

                    blocks: {

                        Settypeto: {

                            id: "Settypeto",
                            name: "Set type",
                            svgId: "Settypeto",
                            action: "settype",
                            isC: false,
                            dataSrc: null,

                            options: [
                                "<!doctype html>"
                            ],

                            dropdowns: [
                                {
                                    dropdown: 1,

                                    options: [
                                        {
                                            name: "<!doctype html>",
                                            action: "<!doctype html>",
                                            value: "<!doctype html>"
                                        }
                                    ]
                                }
                            ],

                            inputs: []

                        },


                        Html: {

                            id: "Html",
                            name: "HTML",
                            svgId: "Html",

                            action:
                                '<html lang="{dropdown1}">',

                            isC: true,
                            dataSrc: null,

                            options: [
                                "en",
                                "es"
                            ],

                            dropdowns: [
                                {
                                    dropdown: 1,

                                    options: [
                                        {
                                            name: "en",
                                            action: "en",
                                            value: "en"
                                        },
                                        {
                                            name: "es",
                                            action: "es",
                                            value: "es"
                                        }
                                    ]
                                }
                            ],

                            inputs: []

                        },


                        Head: {

                            id: "Head",
                            name: "Head",
                            svgId: "Head",
                            action: "<head>",
                            isC: true,
                            dataSrc: null,
                            options: [],
                            dropdowns: [],
                            inputs: []

                        }

                    }

                }

            }

        },


        javascript: {

            id: "javascript",
            name: "JavaScript",
            categories: {}

        },


        css: {

            id: "css",
            name: "CSS",
            categories: {}

        }

    },

    currentLanguage: "html",
    selectedBlock: null,
    workspaceBlocks: [],
    nextWorkspaceId: 1

};


/* =========================================================
   DOM
========================================================= */

const languageSelect =
    document.getElementById("languageSelect");

const categories =
    document.getElementById("categories");

const workspace =
    document.getElementById("workspace");

const workspaceEmpty =
    document.getElementById("workspaceEmpty");

const codeOutput =
    document.getElementById("codeOutput");

const previewContainer =
    document.getElementById("previewContainer");

const htmlPreview =
    document.getElementById("htmlPreview");


/* =========================================================
   SHORTCUT
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   ID
========================================================= */

function normalizeId(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, "_");

}


/* =========================================================
   CURRENT LANGUAGE
========================================================= */

function getCurrentLanguage() {

    return state.languages[
        state.currentLanguage
    ];

}


/* =========================================================
   CURRENT CATEGORY
========================================================= */

function getCurrentCategory() {

    const language =
        getCurrentLanguage();

    if (!language) {
        return null;
    }

    const ids =
        Object.keys(language.categories);

    if (!ids.length) {
        return null;
    }

    return language.categories[ids[0]];

}


/* =========================================================
   SVG SOURCE
========================================================= */

function getSvgSource(
    block,
    languageId,
    categoryId
) {

    if (
        block.dataSrc &&
        block.dataSrc.trim()
    ) {

        return (
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(block.dataSrc)
        );

    }

    const svgId =
        block.svgId ||
        block.id;

    return (
        SVG_ROOT +
        encodeURIComponent(languageId) +
        "/" +
        encodeURIComponent(categoryId) +
        "/" +
        encodeURIComponent(svgId) +
        ".svg"
    );

}


/* =========================================================
   LANGUAGE SELECT
========================================================= */

function renderLanguageSelect() {

    languageSelect.innerHTML = "";

    Object.values(state.languages)
        .forEach(language => {

            const option =
                document.createElement("option");

            option.value =
                language.id;

            option.textContent =
                language.name;

            languageSelect.appendChild(option);

        });

    languageSelect.value =
        state.currentLanguage;

}


/* =========================================================
   PALETTE
========================================================= */

function renderPalette() {

    categories.innerHTML = "";

    const language =
        getCurrentLanguage();

    if (!language) {
        return;
    }

    Object.values(language.categories)
        .forEach(category => {

            const categoryElement =
                document.createElement("div");

            categoryElement.className =
                "category";


            const header =
                document.createElement("div");

            header.className =
                "categoryHeader";

            header.style.background =
                category.color || "#555";

            header.textContent =
                category.name;


            const blockContainer =
                document.createElement("div");

            blockContainer.className =
                "categoryBlocks";


            Object.values(category.blocks)
                .forEach(block => {

                    blockContainer.appendChild(
                        createPaletteBlock(
                            block,
                            language.id,
                            category.id
                        )
                    );

                });


            categoryElement.appendChild(header);
            categoryElement.appendChild(blockContainer);

            categories.appendChild(categoryElement);

        });

}


/* =========================================================
   C BLOCK INDICATOR
========================================================= */

function createCBlockIndicator() {

    const indicator =
        document.createElement("span");

    indicator.className =
        "cBlockIndicator";

    indicator.textContent =
        "C";

    indicator.title =
        "C block: permite bloques dentro";

    indicator.setAttribute(
        "aria-label",
        "C block"
    );

    indicator.style.position =
        "absolute";

    indicator.style.left =
        "4px";

    indicator.style.top =
        "28px";

    indicator.style.right =
        "auto";

    indicator.style.zIndex =
        "30";

    indicator.style.display =
        "flex";

    indicator.style.alignItems =
        "center";

    indicator.style.justifyContent =
        "center";

    indicator.style.width =
        "16px";

    indicator.style.height =
        "16px";

    indicator.style.boxSizing =
        "border-box";

    indicator.style.borderRadius =
        "3px";

    indicator.style.fontFamily =
        "Arial, sans-serif";

    indicator.style.fontSize =
        "10px";

    indicator.style.fontWeight =
        "700";

    indicator.style.lineHeight =
        "1";

    indicator.style.background =
        "rgba(255,255,255,0.9)";

    indicator.style.color =
        "#333";

    indicator.style.border =
        "1px solid rgba(0,0,0,0.35)";

    indicator.style.boxShadow =
        "0 1px 2px rgba(0,0,0,0.25)";

    indicator.style.pointerEvents =
        "none";

    indicator.style.userSelect =
        "none";

    return indicator;

}


/* =========================================================
   PALETTE BLOCK
========================================================= */

function createPaletteBlock(
    block,
    languageId,
    categoryId
) {

    const element =
        document.createElement("div");

    element.className =
        "paletteBlock";

    element.style.position =
        "relative";

    element.draggable =
        true;

    element.dataset.blockId =
        block.id;

    element.dataset.language =
        languageId;

    element.dataset.category =
        categoryId;


    const image =
        document.createElement("img");

    image.className =
        "blockSvg";

    image.src =
        getSvgSource(
            block,
            languageId,
            categoryId
        );

    image.alt =
        block.name ||
        block.id;

    image.draggable =
        false;

    element.appendChild(image);


    if (block.isC) {

        element.appendChild(
            createCBlockIndicator()
        );

    }


    element.addEventListener(
        "dragstart",
        event => {

            const payload = {

                blockId:
                    block.id,

                language:
                    languageId,

                category:
                    categoryId

            };

            event.dataTransfer.effectAllowed =
                "copy";

            event.dataTransfer.setData(
                "application/x-scratch-block",
                JSON.stringify(payload)
            );

            event.dataTransfer.setData(
                "text/plain",
                JSON.stringify(payload)
            );

        }
    );


    element.addEventListener(
        "dblclick",
        () => {

            addBlockToWorkspace(
                block,
                languageId,
                categoryId,
                32,
                32
            );

        }
    );


    return element;

}


/* =========================================================
   WORKSPACE DRAGOVER
========================================================= */

workspace.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        event.dataTransfer.dropEffect =
            "copy";

        workspace.classList.add(
            "dropTarget"
        );

    }
);


/* =========================================================
   WORKSPACE DRAGLEAVE
========================================================= */

workspace.addEventListener(
    "dragleave",
    event => {

        if (
            !workspace.contains(
                event.relatedTarget
            )
        ) {

            workspace.classList.remove(
                "dropTarget"
            );

        }

    }
);


/* =========================================================
   WORKSPACE DROP
========================================================= */

workspace.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        workspace.classList.remove(
            "dropTarget"
        );


        let raw =
            event.dataTransfer.getData(
                "application/x-scratch-block"
            );

        if (!raw) {

            raw =
                event.dataTransfer.getData(
                    "text/plain"
                );

        }

        if (!raw) {
            return;
        }


        let data;

        try {

            data =
                JSON.parse(raw);

        }

        catch {

            return;

        }


        const language =
            state.languages[data.language];

        if (!language) {
            return;
        }


        const category =
            language.categories[data.category];

        if (!category) {
            return;
        }


        const block =
            category.blocks[data.blockId];

        if (!block) {
            return;
        }


        const parent =
            findCBlockAtPoint(
                event.clientX,
                event.clientY,
                null
            );


        if (parent) {

            const rect =
                parent.cBody.getBoundingClientRect();

            const x =
                Math.max(
                    0,
                    Math.round(
                        (
                            event.clientX -
                            rect.left -
                            16
                        ) /
                        SNAP_SIZE
                    ) *
                    SNAP_SIZE
                );

            const y =
                Math.max(
                    0,
                    Math.round(
                        (
                            event.clientY -
                            rect.top -
                            12
                        ) /
                        SNAP_SIZE
                    ) *
                    SNAP_SIZE
                );


            addBlockToWorkspace(
                block,
                data.language,
                data.category,
                x,
                y,
                parent
            );

        }

        else {

            const rect =
                workspace.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left +
                workspace.scrollLeft;

            const y =
                event.clientY -
                rect.top +
                workspace.scrollTop;

            const snapped =
                snapPosition(x, y);


            addBlockToWorkspace(
                block,
                data.language,
                data.category,
                snapped.x,
                snapped.y,
                null
            );

        }

    }
);


/* =========================================================
   SNAP POSITION
========================================================= */

function snapPosition(x, y) {

    let resultX =
        Math.round(
            x / SNAP_SIZE
        ) *
        SNAP_SIZE;

    let resultY =
        Math.round(
            y / SNAP_SIZE
        ) *
        SNAP_SIZE;


    for (
        const existing of
        getRootBlocks()
    ) {

        const dx =
            Math.abs(
                resultX -
                existing.x
            );


        if (
            dx <=
            SNAP_DISTANCE
        ) {

            const existingElement =
                existing.element;


            if (existingElement) {

                const height =
                    existingElement.offsetHeight;

                const possibleY =
                    existing.y +
                    height +
                    BLOCK_GAP;


                if (
                    Math.abs(
                        resultY -
                        possibleY
                    ) <=
                    SNAP_DISTANCE
                ) {

                    resultX =
                        existing.x;

                    resultY =
                        Math.round(
                            possibleY /
                            SNAP_SIZE
                        ) *
                        SNAP_SIZE;

                }

            }

        }

    }


    return {

        x:
            Math.max(
                0,
                resultX
            ),

        y:
            Math.max(
                0,
                resultY
            )

    };

}


/* =========================================================
   ADD WORKSPACE BLOCK
========================================================= */

function addBlockToWorkspace(
    block,
    languageId,
    categoryId,
    x,
    y,
    parent = null
) {

    if (
        !block ||
        typeof block !== "object"
    ) {

        console.error(
            "Invalid block passed to addBlockToWorkspace:",
            block
        );

        return null;

    }


    if (!Array.isArray(block.inputs)) {
        block.inputs = [];
    }


    if (!Array.isArray(block.dropdowns)) {
        block.dropdowns = [];
    }


    const instance = {

        uid:
            "workspaceBlock_" +
            state.nextWorkspaceId++,

        blockId:
            block.id,

        language:
            languageId,

        category:
            categoryId,

        x:
            Number(x) || 0,

        y:
            Number(y) || 0,

        values: {},

        dropdownValues: {},

        children: [],

        parent:
            parent || null,

        element:
            null,

        isC:
            Boolean(block.isC),

        cBody:
            null,

        cHint:
            null

    };


    block.inputs.forEach(
        (input, index) => {

            const key =
                "input" +
                (index + 1);

            let value;


            if (
                input.defaultValue !==
                undefined
            ) {

                value =
                    input.defaultValue;

            }

            else if (
                input.default !==
                undefined
            ) {

                value =
                    input.default;

            }

            else {

                value =
                    getDefaultInputValue(
                        input.type
                    );

            }


            instance.values[key] =
                convertInputValue(
                    value,
                    input.type
                );

        }
    );


    block.dropdowns.forEach(
        dropdown => {

            const first =
                dropdown.options &&
                dropdown.options[0];

            instance.dropdownValues[
                "dropdown" +
                dropdown.dropdown
            ] =
                first
                    ? first.value
                    : "";

        }
    );


    state.workspaceBlocks.push(
        instance
    );


    if (parent) {

        parent.children.push(
            instance
        );

    }


    const element =
        createWorkspaceElement(
            instance,
            block
        );


    instance.element =
        element;


    if (
        parent &&
        parent.cBody
    ) {

        parent.cBody.appendChild(
            element
        );

    }

    else {

        workspace.appendChild(
            element
        );

    }


    selectWorkspaceBlock(
        instance
    );


    updateContainerLayout(
        parent
    );

    updateWorkspaceEmpty();

    updateCode();


    return instance;

}


/* =========================================================
   CREATE WORKSPACE ELEMENT
========================================================= */

function createWorkspaceElement(
    instance,
    block
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "workspaceBlock" +
        (
            block.isC
                ? " cBlock"
                : ""
        );


    wrapper.dataset.uid =
        instance.uid;


    wrapper.style.left =
        instance.x + "px";

    wrapper.style.top =
        instance.y + "px";

    wrapper.style.position =
        "absolute";

    wrapper.style.boxSizing =
        "border-box";


    const image =
        document.createElement("img");

    image.className =
        "blockSvg";

    image.src =
        getSvgSource(
            block,
            instance.language,
            instance.category
        );

    image.alt =
        block.name ||
        block.id;

    image.draggable =
        false;

    wrapper.appendChild(image);


    /* =====================================================
       INPUTS
    ===================================================== */

    if (
        Array.isArray(block.inputs) &&
        block.inputs.length
    ) {

        const inputContainer =
            document.createElement("div");

        inputContainer.className =
            "blockInputs";


        block.inputs.forEach(
            (input, index) => {

                const number =
                    index + 1;

                const row =
                    document.createElement("span");

                row.className =
                    "blockInputRow";


                const label =
                    document.createElement("span");

                label.className =
                    "inputLabel";

                label.textContent =
                    input.label ||
                    input.name ||
                    ("Input " + number);


                const control =
                    createBlockInput(
                        input,
                        instance,
                        number
                    );


                row.appendChild(label);
                row.appendChild(control);

                inputContainer.appendChild(row);

            }
        );


        wrapper.appendChild(
            inputContainer
        );

    }


    /* =====================================================
       DROPDOWNS
    ===================================================== */

    if (
        Array.isArray(block.dropdowns) &&
        block.dropdowns.length
    ) {

        const dropdownContainer =
            document.createElement("div");

        dropdownContainer.className =
            "blockDropdowns";


        block.dropdowns.forEach(
            dropdown => {

                const select =
                    document.createElement("select");

                select.className =
                    "blockDropdown";


                const key =
                    "dropdown" +
                    dropdown.dropdown;


                (dropdown.options || [])
                    .forEach(option => {

                        const item =
                            document.createElement("option");

                        item.value =
                            option.value ?? "";

                        item.textContent =
                            option.name ??
                            option.value ??
                            "";

                        select.appendChild(item);

                    });


                select.value =
                    instance.dropdownValues[key] ??
                    "";


                select.addEventListener(
                    "change",
                    () => {

                        instance.dropdownValues[key] =
                            select.value;

                        updateCode();

                    }
                );


                dropdownContainer.appendChild(
                    select
                );

            }
        );


        wrapper.appendChild(
            dropdownContainer
        );

    }


    /* =====================================================
       C BLOCK BODY
    ===================================================== */

    if (block.isC) {

        const body =
            document.createElement("div");


        body.className =
            "cBlockBody";


        body.dataset.parentUid =
            instance.uid;


        body.style.position =
            "relative";

        body.style.minHeight =
            "52px";

        body.style.boxSizing =
            "border-box";

        body.style.marginTop =
            "4px";

        body.style.marginBottom =
            "4px";

        body.style.padding =
            "24px 0 8px 24px";

        body.style.width =
            "100%";

        body.style.overflow =
            "visible";


        const hint =
            document.createElement("div");

        hint.className =
            "cBlockDropHint";

        hint.textContent =
            "Suelta bloques aquí";

        hint.style.pointerEvents =
            "none";

        hint.style.opacity =
            "0.55";

        hint.style.fontSize =
            "11px";

        hint.style.padding =
            "4px 8px";


        /*
            El indicador C está dentro
            de la zona donde van los
            bloques internos.
        */

        body.appendChild(
            createCBlockIndicator()
        );

        body.appendChild(
            hint
        );


        instance.cBody =
            body;

        instance.cHint =
            hint;


        wrapper.appendChild(
            body
        );

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    wrapper.addEventListener(
        "mousedown",
        event => {

            if (
                event.target.closest(
                    "input, select, textarea, button"
                )
            ) {

                return;

            }


            selectWorkspaceBlock(
                instance
            );


            startWorkspaceDrag(
                event,
                instance,
                wrapper
            );

        }
    );


    wrapper.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    "input, select, textarea, button"
                )
            ) {

                return;

            }


            selectWorkspaceBlock(
                instance
            );

        }
    );


    return wrapper;

}


/* =========================================================
   INPUT CREATION
========================================================= */

function createBlockInput(
    input,
    instance,
    number
) {

    let control;


    if (
        input.type ===
        "boolean"
    ) {

        control =
            document.createElement("select");


        control.className =
            "blockBoolean";


        const trueOption =
            document.createElement("option");

        trueOption.value =
            "true";

        trueOption.textContent =
            "true";


        const falseOption =
            document.createElement("option");

        falseOption.value =
            "false";

        falseOption.textContent =
            "false";


        control.appendChild(
            trueOption
        );

        control.appendChild(
            falseOption
        );


        control.value =
            String(
                instance.values[
                    "input" +
                    number
                ]
            );

    }


    else {

        control =
            document.createElement("input");


        control.className =
            "blockInput";


        if (
            input.type ===
            "number"
        ) {

            control.type =
                "number";

            control.step =
                "any";

        }

        else {

            control.type =
                "text";

        }


        control.value =
            instance.values[
                "input" +
                number
            ] ??
            "";

    }


    control.dataset.input =
        "input" +
        number;


    control.addEventListener(
        "input",
        () => {

            let value =
                control.value;


            if (
                input.type ===
                "number"
            ) {

                value =
                    value === ""
                        ? ""
                        : Number(value);

            }


            else if (
                input.type ===
                "boolean"
            ) {

                value =
                    value === "true";

            }


            instance.values[
                "input" +
                number
            ] =
                value;


            updateCode();

        }
    );


    return control;

}


/* =========================================================
   DEFAULT INPUT
========================================================= */

function getDefaultInputValue(type) {

    if (
        type ===
        "boolean"
    ) {

        return true;

    }


    if (
        type ===
        "number"
    ) {

        return 0;

    }


    return "";

}


/* =========================================================
   WORKSPACE DRAG
========================================================= */

function startWorkspaceDrag(
    event,
    instance,
    element
) {

    event.preventDefault();


    const elementRect =
        element.getBoundingClientRect();


    const pointerOffsetX =
        event.clientX -
        elementRect.left;


    const pointerOffsetY =
        event.clientY -
        elementRect.top;


    function move(moveEvent) {

        const parentBody =
            instance.parent
                ? instance.parent.cBody
                : null;


        const rect =
            parentBody
                ? parentBody.getBoundingClientRect()
                : workspace.getBoundingClientRect();


        const scrollX =
            parentBody
                ? parentBody.scrollLeft
                : workspace.scrollLeft;


        const scrollY =
            parentBody
                ? parentBody.scrollTop
                : workspace.scrollTop;


        let x =
            moveEvent.clientX -
            rect.left +
            scrollX -
            pointerOffsetX;


        let y =
            moveEvent.clientY -
            rect.top +
            scrollY -
            pointerOffsetY;


        x =
            Math.round(
                x / SNAP_SIZE
            ) *
            SNAP_SIZE;


        y =
            Math.round(
                y / SNAP_SIZE
            ) *
            SNAP_SIZE;


        const snapped =
            snapExistingBlock(
                instance,
                x,
                y,
                instance.parent
            );


        instance.x =
            snapped.x;

        instance.y =
            snapped.y;


        element.style.left =
            instance.x + "px";

        element.style.top =
            instance.y + "px";


        updateContainerLayout(
            instance.parent
        );

    }


    function up(upEvent) {

        document.removeEventListener(
            "mousemove",
            move
        );

        document.removeEventListener(
            "mouseup",
            up
        );


        const targetParent =
            findCBlockAtPoint(
                upEvent.clientX,
                upEvent.clientY,
                instance
            );


        reparentWorkspaceBlock(
            instance,
            targetParent,
            upEvent.clientX,
            upEvent.clientY,
            pointerOffsetX,
            pointerOffsetY
        );


        updateContainerLayout(
            instance.parent
        );


        updateCode();

    }


    document.addEventListener(
        "mousemove",
        move
    );

    document.addEventListener(
        "mouseup",
        up
    );

}


/* =========================================================
   SNAP EXISTING BLOCK
========================================================= */

function snapExistingBlock(
    moving,
    x,
    y,
    parent = moving.parent || null
) {

    let resultX =
        Math.max(0, x);

    let resultY =
        Math.max(0, y);


    const siblings =
        state.workspaceBlocks.filter(
            block =>
                block !== moving &&
                (block.parent || null) ===
                (parent || null) &&
                block.element
        );


    for (
        const other of siblings
    ) {

        const movingWidth =
            moving.element.offsetWidth;

        const movingHeight =
            moving.element.offsetHeight;

        const otherWidth =
            other.element.offsetWidth;

        const otherHeight =
            other.element.offsetHeight;


        if (
            Math.abs(
                resultY +
                movingHeight -
                other.y
            ) <= SNAP_DISTANCE &&

            Math.abs(
                resultX -
                other.x
            ) <= SNAP_DISTANCE
        ) {

            resultX =
                other.x;

            resultY =
                other.y -
                movingHeight -
                BLOCK_GAP;

        }


        if (
            Math.abs(
                resultY -
                (
                    other.y +
                    otherHeight
                )
            ) <= SNAP_DISTANCE &&

            Math.abs(
                resultX -
                other.x
            ) <= SNAP_DISTANCE
        ) {

            resultX =
                other.x;

            resultY =
                other.y +
                otherHeight +
                BLOCK_GAP;

        }


        if (
            Math.abs(
                resultX +
                movingWidth -
                other.x
            ) <= SNAP_DISTANCE &&

            rangesOverlap(
                resultY,
                resultY + movingHeight,
                other.y,
                other.y + otherHeight
            )
        ) {

            resultX =
                other.x -
                movingWidth -
                BLOCK_GAP;

        }


        if (
            Math.abs(
                resultX -
                (
                    other.x +
                    otherWidth
                )
            ) <= SNAP_DISTANCE &&

            rangesOverlap(
                resultY,
                resultY + movingHeight,
                other.y,
                other.y + otherHeight
            )
        ) {

            resultX =
                other.x +
                otherWidth +
                BLOCK_GAP;

        }

    }


    return {

        x:
            Math.max(
                0,
                Math.round(
                    resultX /
                    SNAP_SIZE
                ) *
                SNAP_SIZE
            ),

        y:
            Math.max(
                0,
                Math.round(
                    resultY /
                    SNAP_SIZE
                ) *
                SNAP_SIZE
            )

    };

}


/* =========================================================
   RANGE OVERLAP
========================================================= */

function rangesOverlap(
    a1,
    a2,
    b1,
    b2
) {

    return (
        a1 < b2 &&
        a2 > b1
    );

}


/* =========================================================
   SELECT
========================================================= */

function selectWorkspaceBlock(
    instance
) {

    state.workspaceBlocks.forEach(
        block => {

            if (
                block.element
            ) {

                block.element
                    .classList
                    .remove(
                        "selected"
                    );

            }

        }
    );


    state.selectedBlock =
        instance;


    if (
        instance &&
        instance.element
    ) {

        instance.element
            .classList
            .add(
                "selected"
            );

    }

}


/* =========================================================
   DELETE
========================================================= */

$("deleteSelectedButton")
    .addEventListener(
        "click",
        () => {

            const selected =
                state.selectedBlock;

            if (!selected) {
                return;
            }


            removeWorkspaceBlock(
                selected
            );


            state.selectedBlock =
                null;


            updateWorkspaceEmpty();
            updateCode();

        }
    );


/* =========================================================
   CLEAR
========================================================= */

$("clearButton")
    .addEventListener(
        "click",
        clearWorkspace
    );


function clearWorkspace() {

    state.workspaceBlocks.forEach(
        block => {

            if (block.element) {
                block.element.remove();
            }

        }
    );


    state.workspaceBlocks.length =
        0;

    state.selectedBlock =
        null;

    updateWorkspaceEmpty();
    updateCode();

}


/* =========================================================
   EMPTY
========================================================= */

function updateWorkspaceEmpty() {

    workspaceEmpty.style.display =
        state.workspaceBlocks.length
            ? "none"
            : "flex";

}


/* =========================================================
   ROOT BLOCKS
========================================================= */

function getRootBlocks() {

    return state.workspaceBlocks.filter(
        block => !block.parent
    );

}


/* =========================================================
   CODE
========================================================= */

function updateCode() {

    const blocks =
        getRootBlocks()
            .sort(
                (a, b) => {

                    if (
                        a.y !==
                        b.y
                    ) {

                        return (
                            a.y -
                            b.y
                        );

                    }

                    return (
                        a.x -
                        b.x
                    );

                }
            );


    const lines =
        blocks.map(
            block =>
                generateBlockCode(
                    block
                )
        );


    const code =
        lines
            .filter(
                line =>
                    line !== null &&
                    line !== ""
            )
            .join("\n");


    codeOutput.textContent =
        code;


    updatePreview(
        code
    );

}


/* =========================================================
   DESCENDANT
========================================================= */

function isDescendantOf(
    instance,
    possibleAncestor
) {

    let current =
        instance;


    while (current) {

        if (
            current ===
            possibleAncestor
        ) {

            return true;

        }


        current =
            current.parent ||
            null;

    }


    return false;

}


/* =========================================================
   FIND C BLOCK
========================================================= */

function findCBlockAtPoint(
    clientX,
    clientY,
    moving
) {

    const candidates =
        state.workspaceBlocks
            .filter(
                block =>
                    block !== moving &&
                    block.isC &&
                    block.cBody
            )
            .filter(
                block =>
                    !isDescendantOf(
                        block,
                        moving
                    )
            );


    for (
        let i =
            candidates.length - 1;
        i >= 0;
        i--
    ) {

        const body =
            candidates[i].cBody;


        const rect =
            body.getBoundingClientRect();


        if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        ) {

            return candidates[i];

        }

    }


    return null;

}


/* =========================================================
   REPARENT
========================================================= */

function reparentWorkspaceBlock(
    instance,
    newParent,
    clientX,
    clientY,
    offsetX,
    offsetY
) {

    const oldParent =
        instance.parent ||
        null;


    if (
        newParent === instance ||
        isDescendantOf(
            newParent,
            instance
        )
    ) {

        newParent =
            oldParent;

    }


    if (
        oldParent ===
        newParent
    ) {

        return;

    }


    if (oldParent) {

        oldParent.children =
            oldParent.children.filter(
                child =>
                    child !== instance
            );

    }


    instance.parent =
        newParent ||
        null;


    if (newParent) {

        if (
            !newParent.children.includes(
                instance
            )
        ) {

            newParent.children.push(
                instance
            );

        }


        if (
            instance.element.parentNode !==
            newParent.cBody
        ) {

            newParent.cBody.appendChild(
                instance.element
            );

        }


        const rect =
            newParent.cBody
                .getBoundingClientRect();


        instance.x =
            Math.max(
                0,
                Math.round(
                    (
                        clientX -
                        rect.left -
                        offsetX
                    ) /
                    SNAP_SIZE
                ) *
                SNAP_SIZE
            );


        instance.y =
            Math.max(
                0,
                Math.round(
                    (
                        clientY -
                        rect.top -
                        offsetY
                    ) /
                    SNAP_SIZE
                ) *
                SNAP_SIZE
            );

    }


    else {

        if (
            instance.element.parentNode !==
            workspace
        ) {

            workspace.appendChild(
                instance.element
            );

        }


        const rect =
            workspace.getBoundingClientRect();


        instance.x =
            Math.max(
                0,
                Math.round(
                    (
                        clientX -
                        rect.left +
                        workspace.scrollLeft -
                        offsetX
                    ) /
                    SNAP_SIZE
                ) *
                SNAP_SIZE
            );


        instance.y =
            Math.max(
                0,
                Math.round(
                    (
                        clientY -
                        rect.top +
                        workspace.scrollTop -
                        offsetY
                    ) /
                    SNAP_SIZE
                ) *
                SNAP_SIZE
            );

    }


    instance.element.style.left =
        instance.x + "px";

    instance.element.style.top =
        instance.y + "px";


    if (newParent) {

        updateContainerLayout(
            newParent
        );

    }

}


/* =========================================================
   C BLOCK LAYOUT
========================================================= */

function updateContainerLayout(
    parent
) {

    if (
        !parent ||
        !parent.cBody
    ) {

        return;

    }


    const children =
        parent.children ||
        [];


    const left =
        24;

    const top =
        4;

    const gap =
        0;


    let currentY =
        top;


    children.forEach(
        child => {

            if (
                !child ||
                !child.element
            ) {

                return;

            }


            /*
                Si el hijo también es C,
                actualizamos primero su
                propio contenido.
            */

            if (
                child.isC
            ) {

                updateContainerLayout(
                    child
                );

            }


            child.x =
                left;

            child.y =
                currentY;


            child.element.style.position =
                "absolute";

            child.element.style.left =
                child.x + "px";

            child.element.style.top =
                child.y + "px";


            currentY +=
                child.element.offsetHeight +
                gap;

        }
    );


    const minimumHeight =
        children.length
            ? currentY + 4
            : 52;


    parent.cBody.style.minHeight =
        Math.max(
            52,
            minimumHeight
        ) + "px";


    if (
        parent.cHint
    ) {

        parent.cHint.style.display =
            children.length
                ? "none"
                : "block";

        parent.cHint.style.position =
            "absolute";

        parent.cHint.style.left =
            "24px";

        parent.cHint.style.top =
            "4px";

    }


    /*
        Si cambia la altura de un C
        anidado, actualizamos también
        sus padres.
    */

    if (
        parent.parent
    ) {

        updateContainerLayout(
            parent.parent
        );

    }

}


/* =========================================================
   REMOVE BLOCK
========================================================= */

function removeWorkspaceBlock(
    instance
) {

    if (!instance) {
        return;
    }


    const children =
        [
            ...(instance.children || [])
        ];


    children.forEach(
        child =>
            removeWorkspaceBlock(
                child
            )
    );


    if (
        instance.parent
    ) {

        instance.parent.children =
            instance.parent.children.filter(
                child =>
                    child !== instance
            );


        updateContainerLayout(
            instance.parent
        );

    }


    if (
        instance.element
    ) {

        instance.element.remove();

    }


    const index =
        state.workspaceBlocks.indexOf(
            instance
        );


    if (
        index !== -1
    ) {

        state.workspaceBlocks.splice(
            index,
            1
        );

    }

}


/* =========================================================
   HTML TAG
========================================================= */

function resolveHtmlTag(
    instance,
    blockCode
) {

    let tag =
        instance.values.tag ||
        instance.values.input1 ||
        instance.dropdownValues.tag ||
        "div";


    tag =
        String(tag)
            .trim()
            .replace(
                /^<|>$/g,
                ""
            );


    if (!tag) {
        tag = "div";
    }


    return tag;

}


/* =========================================================
   C BLOCK CODE
========================================================= */

function generateCBlockCode(
    openingCode,
    childCode,
    block,
    instance
) {

    const hasChildren =
        Boolean(childCode);


    let code =
        openingCode;


    /*
        <<etiqueta html>>
    */

    if (
        code.includes(
            "<<etiqueta html>>"
        ) ||
        code.includes(
            "</<etiqueta html>>"
        )
    ) {

        const tag =
            resolveHtmlTag(
                instance,
                code
            );


        code =
            code.replaceAll(
                "<<etiqueta html>>",
                "<" + tag + ">"
            );


        code =
            code.replaceAll(
                "</<etiqueta html>>",
                "</" + tag + ">"
            );


        if (
            !code.includes(
                "</" + tag + ">"
            )
        ) {

            code +=
                "\n</" +
                tag +
                ">";

        }


        return code.replace(
            "{children}",
            hasChildren
                ? "\n" +
                  childCode +
                  "\n"
                : ""
        );

    }


    /*
        {}
    */

    if (
        code.includes("{}")
    ) {

        const parts =
            code.split(
                "{}",
                1
            );


        const open =
            parts[0].trimEnd() +
            " {";


        return (
            open +
            (
                hasChildren
                    ? "\n" +
                      childCode +
                      "\n"
                    : "\n"
            ) +
            "}"
        );

    }


    /*
        HTML normal
    */

    const htmlOpen =
        code.match(
            /^\s*<([A-Za-z][A-Za-z0-9-]*)(\s[^>]*)?>\s*$/
        );


    if (
        htmlOpen &&
        !/\/\s*>$/.test(code)
    ) {

        const tag =
            htmlOpen[1];


        return (
            code +
            (
                hasChildren
                    ? "\n" +
                      childCode +
                      "\n"
                    : "\n"
            ) +
            "</" +
            tag +
            ">"
        );

    }


    /*
        []
    */

    if (
        code.includes("[]")
    ) {

        const parts =
            code.split(
                "[]",
                1
            );


        const open =
            parts[0].trimEnd() +
            " [";


        return (
            open +
            (
                hasChildren
                    ? "\n" +
                      childCode +
                      "\n"
                    : "\n"
            ) +
            "]"
        );

    }


    /*
        end
    */

    if (
        /\bend\b/i.test(code)
    ) {

        const open =
            code.replace(
                /\bend\b/ig,
                ""
            )
            .trimEnd();


        return (
            open +
            (
                hasChildren
                    ? "\n" +
                      childCode +
                      "\n"
                    : "\n"
            ) +
            "end"
        );

    }


    /*
        :
    */

    if (
        /:\s*$/.test(code)
    ) {

        return (
            code.trimEnd() +
            (
                hasChildren
                    ? "\n" +
                      childCode
                    : ""
            )
        );

    }


    return code.replace(
        "{children}",
        childCode
    );

}


/* =========================================================
   GENERATE BLOCK CODE
========================================================= */

function generateBlockCode(
    instance
) {

    const language =
        state.languages[
            instance.language
        ];


    if (!language) {
        return "";
    }


    const category =
        language.categories[
            instance.category
        ];


    if (!category) {
        return "";
    }


    const block =
        category.blocks[
            instance.blockId
        ];


    if (!block) {
        return "";
    }


    let code =
        block.action ||
        "";


    /*
        DROPDOWNS
    */

    if (
        Array.isArray(
            block.dropdowns
        )
    ) {

        block.dropdowns.forEach(
            dropdown => {

                const key =
                    "dropdown" +
                    dropdown.dropdown;


                const selected =
                    instance.dropdownValues[
                        key
                    ];


                const option =
                    (
                        dropdown.options ||
                        []
                    )
                    .find(
                        item =>
                            String(
                                item.value
                            ) ===
                            String(
                                selected
                            )
                    );


                const value =
                    option
                        ? option.value
                        : selected;


                const name =
                    option
                        ? option.name
                        : value;


                const action =
                    option
                        ? option.action
                        : value;


                code =
                    code.replaceAll(
                        "{" +
                        key +
                        ".name}",
                        name ?? ""
                    );


                code =
                    code.replaceAll(
                        "{" +
                        key +
                        ".action}",
                        action ?? ""
                    );


                code =
                    code.replaceAll(
                        "{" +
                        key +
                        ".value}",
                        value ?? ""
                    );


                code =
                    code.replaceAll(
                        "{" +
                        key +
                        "}",
                        value ?? ""
                    );

            }
        );

    }


    /*
        INPUTS
    */

    if (
        Array.isArray(
            block.inputs
        )
    ) {

        block.inputs.forEach(
            (input, index) => {

                const key =
                    "input" +
                    (index + 1);


                let value =
                    instance.values[key];


                if (
                    input.type ===
                    "boolean"
                ) {

                    value =
                        Boolean(value);

                }


                if (
                    input.type ===
                    "number" &&
                    (
                        value === "" ||
                        value == null
                    )
                ) {

                    value =
                        0;

                }


                if (
                    input.type ===
                    "string" &&
                    value == null
                ) {

                    value =
                        "";

                }


                code =
                    code.replaceAll(
                        "{" +
                        key +
                        "}",
                        String(value)
                    );

            }
        );

    }


    /*
        CHILDREN
    */

    const childCode =
        (
            instance.children ||
            []
        )
        .slice()
        .sort(
            (a, b) =>
                a.y !== b.y
                    ? a.y - b.y
                    : a.x - b.x
        )
        .map(
            child =>
                generateBlockCode(
                    child
                )
        )
        .filter(Boolean)
        .join("\n");


    if (!block.isC) {

        return code
            .replaceAll(
                "{children}",
                childCode
            )
            .trim();

    }


    return generateCBlockCode(
        code,
        childCode,
        block,
        instance
    ).trim();

}


/* =========================================================
   PREVIEW
========================================================= */

function updatePreview(code) {

    if (
        state.currentLanguage ===
        "html"
    ) {

        previewContainer
            .classList
            .add("visible");


        htmlPreview.srcdoc =
            code;

    }

    else {

        previewContainer
            .classList
            .remove("visible");


        htmlPreview.srcdoc =
            "";

    }

}


/* =========================================================
   COPY
========================================================= */

$("copyButton")
    .addEventListener(
        "click",
        async () => {

            const text =
                codeOutput.textContent;


            try {

                await navigator
                    .clipboard
                    .writeText(
                        text
                    );

            }

            catch {

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    text;


                document.body.appendChild(
                    textarea
                );


                textarea.select();


                document.execCommand(
                    "copy"
                );


                textarea.remove();

            }

        }
    );


/* =========================================================
   LANGUAGE CHANGE
========================================================= */

languageSelect.addEventListener(
    "change",
    () => {

        state.currentLanguage =
            languageSelect.value;

        state.selectedBlock =
            null;

        renderPalette();

        updateCode();

    }
);


/* =========================================================
   MODAL HELPERS
========================================================= */

function openModal(id) {

    $(id)
        .classList
        .remove("hidden");

}


function closeModal(id) {

    $(id)
        .classList
        .add("hidden");

}


/* =========================================================
   LANGUAGE MODAL
========================================================= */

$("addLanguageButton")
    .addEventListener(
        "click",
        () => {

            $("languageId").value =
                "";

            $("languageName").value =
                "";

            openModal(
                "languageModal"
            );

        }
    );


$("cancelLanguageButton")
    .addEventListener(
        "click",
        () => {

            closeModal(
                "languageModal"
            );

        }
    );


$("saveLanguageButton")
    .addEventListener(
        "click",
        () => {

            const id =
                normalizeId(
                    $("languageId").value
                );


            const name =
                $("languageName")
                    .value
                    .trim();


            if (
                !id ||
                !name
            ) {

                alert(
                    "Enter a language ID and name."
                );

                return;

            }


            if (
                state.languages[id]
            ) {

                alert(
                    "That language already exists."
                );

                return;

            }


            state.languages[id] = {

                id,
                name,
                categories: {}

            };


            state.currentLanguage =
                id;


            renderLanguageSelect();
            renderPalette();
            updateCode();


            closeModal(
                "languageModal"
            );

        }
    );


/* =========================================================
   CATEGORY MODAL
========================================================= */

$("addCategoryButton")
    .addEventListener(
        "click",
        () => {

            $("categoryId").value =
                "";

            $("categoryName").value =
                "";

            $("categoryColor").value =
                "#4C97FF";


            openModal(
                "categoryModal"
            );

        }
    );


$("cancelCategoryButton")
    .addEventListener(
        "click",
        () => {

            closeModal(
                "categoryModal"
            );

        }
    );


$("saveCategoryButton")
    .addEventListener(
        "click",
        () => {

            const language =
                getCurrentLanguage();


            if (!language) {
                return;
            }


            const id =
                normalizeId(
                    $("categoryId").value
                );


            const name =
                $("categoryName")
                    .value
                    .trim();


            const color =
                $("categoryColor")
                    .value
                    .trim() ||
                "#4C97FF";


            if (
                !id ||
                !name
            ) {

                alert(
                    "Enter a category ID and name."
                );

                return;

            }


            if (
                language.categories[id]
            ) {

                alert(
                    "That category already exists."
                );

                return;

            }


            language.categories[id] = {

                id,
                name,
                color,
                blocks: {}

            };


            renderPalette();


            closeModal(
                "categoryModal"
            );

        }
    );


/* =========================================================
   INPUT EDITOR
========================================================= */

let inputDefinitions =
    [];


function resetInputEditor() {

    inputDefinitions =
        [];

    renderInputEditor();

}


function renderInputEditor() {

    const container =
        $("inputEditorList");


    container.innerHTML =
        "";


    inputDefinitions.forEach(
        (input, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "inputDefinition";


            /* TYPE */

            const type =
                document.createElement(
                    "select"
                );


            [
                "string",
                "boolean",
                "number"
            ]
            .forEach(
                typeName => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        typeName;

                    option.textContent =
                        typeName;


                    if (
                        input.type ===
                        typeName
                    ) {

                        option.selected =
                            true;

                    }


                    type.appendChild(
                        option
                    );

                }
            );


            /* NAME */

            const name =
                document.createElement(
                    "input"
                );


            name.type =
                "text";

            name.placeholder =
                "Name";

            name.value =
                input.name ||
                "";


            /* DEFAULT */

            const defaultValue =
                document.createElement(
                    "input"
                );


            defaultValue.type =
                "text";

            defaultValue.placeholder =
                "Default value";

            defaultValue.value =
                input.defaultValue ??
                "";


            /* REMOVE */

            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";

            remove.className =
                "removeInput";

            remove.textContent =
                "Remove";


            /* EVENTS */

            type.addEventListener(
                "change",
                () => {

                    input.type =
                        type.value;


                    input.defaultValue =
                        getDefaultInputValue(
                            input.type
                        );


                    renderInputEditor();

                }
            );


            name.addEventListener(
                "input",
                () => {

                    input.name =
                        name.value;

                }
            );


            defaultValue.addEventListener(
                "input",
                () => {

                    input.defaultValue =
                        convertInputValue(
                            defaultValue.value,
                            input.type
                        );

                }
            );


            remove.addEventListener(
                "click",
                () => {

                    inputDefinitions.splice(
                        index,
                        1
                    );

                    renderInputEditor();

                }
            );


            row.appendChild(type);
            row.appendChild(name);
            row.appendChild(defaultValue);
            row.appendChild(remove);


            container.appendChild(row);

        }
    );

}


/* =========================================================
   CONVERT INPUT
========================================================= */

function convertInputValue(
    value,
    type
) {

    if (
        type ===
        "boolean"
    ) {

        return (
            String(value)
                .toLowerCase() ===
            "true"
        );

    }


    if (
        type ===
        "number"
    ) {

        const number =
            Number(value);


        return Number.isFinite(
            number
        )
            ? number
            : 0;

    }


    return value;

}


/* =========================================================
   ADD INPUT
========================================================= */

$("addInputButton")
    .addEventListener(
        "click",
        () => {

            inputDefinitions.push({

                type:
                    "string",

                name:
                    "input" +
                    (
                        inputDefinitions.length +
                        1
                    ),

                defaultValue:
                    ""

            });


            renderInputEditor();

        }
    );


/* =========================================================
   DROPDOWN EDITOR
========================================================= */

$("blockDropdownCount")
    .addEventListener(
        "input",
        renderDropdownEditor
    );


function renderDropdownEditor() {

    const container =
        $("dropdownEditor");


    container.innerHTML =
        "";


    let count =
        Number(
            $("blockDropdownCount")
                .value
        );


    if (
        !Number.isFinite(count) ||
        count < 0
    ) {

        count =
            0;

    }


    for (
        let i = 1;
        i <= count;
        i++
    ) {

        const box =
            document.createElement(
                "div"
            );


        box.className =
            "dropdownOption";


        const title =
            document.createElement(
                "div"
            );


        title.className =
            "dropdownTitle";

        title.textContent =
            "Dropdown " +
            i;


        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.rows =
            3;

        textarea.dataset.dropdown =
            i;

        textarea.placeholder =
            "Option 1\nOption 2\nOption 3";


        box.appendChild(title);
        box.appendChild(textarea);

        container.appendChild(box);

    }

}


/* =========================================================
   BLOCK MODAL
========================================================= */

$("addBlockButton")
    .addEventListener(
        "click",
        () => {

            const category =
                getCurrentCategory();


            if (!category) {

                alert(
                    "Create a category first."
                );

                return;

            }


            resetBlockForm();


            openModal(
                "blockModal"
            );

        }
    );


function resetBlockForm() {

    $("blockId").value =
        "";

    $("blockSvgId").value =
        "";

    $("blockName").value =
        "";

    $("blockAction").value =
        "";

    $("blockDropdownCount").value =
        "0";

    $("blockIsC").checked =
        false;

    $("blockDataSrc").value =
        "";


    resetInputEditor();

    renderDropdownEditor();

}


/* =========================================================
   CANCEL BLOCK
========================================================= */

$("cancelBlockButton")
    .addEventListener(
        "click",
        () => {

            closeModal(
                "blockModal"
            );

        }
    );


/* =========================================================
   SAVE BLOCK
========================================================= */

$("saveBlockButton")
    .addEventListener(
        "click",
        saveBlock
    );


function saveBlock() {

    const language =
        getCurrentLanguage();

    const category =
        getCurrentCategory();


    if (
        !language ||
        !category
    ) {

        alert(
            "Create a category first."
        );

        return;

    }


    const id =
        normalizeId(
            $("blockId").value
        );


    const svgId =
        $("blockSvgId")
            .value
            .trim();


    const name =
        $("blockName")
            .value
            .trim();


    const action =
        $("blockAction")
            .value;


    const isC =
        $("blockIsC")
            .checked;


    const dataSrc =
        $("blockDataSrc")
            .value
            .trim();


    if (!id) {

        alert(
            "Enter a block ID."
        );

        return;

    }


    if (!name) {

        alert(
            "Enter a block name."
        );

        return;

    }


    if (
        !svgId &&
        !dataSrc
    ) {

        alert(
            "Enter an SVG file ID or data-src."
        );

        return;

    }


    if (
        category.blocks[id]
    ) {

        alert(
            "That block ID already exists."
        );

        return;

    }


    const inputs =
        inputDefinitions.map(
            (input, index) => ({

                type:
                    input.type,

                name:
                    input.name ||
                    "input" +
                    (index + 1),

                label:
                    input.name ||
                    "Input " +
                    (index + 1),

                defaultValue:
                    convertInputValue(
                        input.defaultValue,
                        input.type
                    )

            })
        );


    const dropdowns =
        [];


    const count =
        Number(
            $("blockDropdownCount")
                .value
        );


    for (
        let i = 1;
        i <= count;
        i++
    ) {

        const textarea =
            document.querySelector(
                '[data-dropdown="' +
                i +
                '"]'
            );


        const raw =
            textarea
                ? textarea.value
                : "";


        const lines =
            raw
                .split("\n")
                .map(
                    value =>
                        value.trim()
                )
                .filter(Boolean);


        dropdowns.push({

            dropdown:
                i,

            options:
                lines.map(
                    value => ({

                        name:
                            value,

                        action:
                            value,

                        value:
                            value

                    })
                )

        });

    }


    const block = {

        id,
        name,
        svgId,
        action,
        isC,

        dataSrc:
            dataSrc ||
            null,

        inputs,
        dropdowns,

        options:
            dropdowns.length
                ? dropdowns[0]
                    .options
                    .map(
                        option =>
                            option.value
                    )
                : []

    };


    category.blocks[id] =
        block;


    renderPalette();

    closeModal(
        "blockModal"
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

function initialize() {

    renderLanguageSelect();

    renderPalette();

    updateWorkspaceEmpty();

    updateCode();

}


initialize();


/* =========================================================
   PUBLIC API
========================================================= */

window.ScratchCodeEditor = {

    state,

    addBlockToWorkspace,

    updateCode,

    renderPalette,

    renderLanguageSelect,

    snapPosition

};