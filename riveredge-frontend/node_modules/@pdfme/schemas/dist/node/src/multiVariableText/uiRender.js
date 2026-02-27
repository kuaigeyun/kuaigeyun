"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiRender = void 0;
const common_1 = require("@pdfme/common");
const uiRender_js_1 = require("../text/uiRender.js");
const utils_js_1 = require("../utils.js");
const helper_js_1 = require("../text/helper.js");
const helper_js_2 = require("./helper.js");
const uiRender = async (arg) => {
    const { value, schema, rootElement, mode, onChange, ...rest } = arg;
    let text = schema.text;
    let numVariables = schema.variables.length;
    if (mode === 'form' && numVariables > 0) {
        await formUiRender(arg);
        return;
    }
    await (0, uiRender_js_1.uiRender)({
        value: (0, utils_js_1.isEditable)(mode, schema) ? text : (0, helper_js_2.substituteVariables)(text, value),
        schema,
        mode: mode === 'form' ? 'viewer' : mode, // if no variables for form it's just a viewer
        rootElement,
        onChange: (arg) => {
            if (!Array.isArray(arg)) {
                if (onChange) {
                    onChange({ key: 'text', value: arg.value });
                }
            }
            else {
                throw new Error('onChange is not an array, the parent text plugin has changed...');
            }
        },
        ...rest,
    });
    const textBlock = rootElement.querySelector('#text-' + String(schema.id));
    if (!textBlock) {
        throw new Error('Text block not found. Ensure the text block has an id of "text-" + schema.id');
    }
    if (mode === 'designer') {
        textBlock.addEventListener('keyup', (event) => {
            text = textBlock.textContent || '';
            if (keyPressShouldBeChecked(event)) {
                const newNumVariables = countUniqueVariableNames(text);
                if (numVariables !== newNumVariables) {
                    // If variables were modified during this keypress, we trigger a change
                    if (onChange) {
                        onChange({ key: 'text', value: text });
                    }
                    numVariables = newNumVariables;
                }
            }
        });
    }
};
exports.uiRender = uiRender;
const formUiRender = async (arg) => {
    const { value, schema, rootElement, onChange, stopEditing, theme, _cache, options } = arg;
    const rawText = schema.text;
    if (rootElement.parentElement) {
        // remove the outline for the whole schema, we'll apply outlines on each individual variable field instead
        rootElement.parentElement.style.outline = '';
    }
    const variables = value
        ? JSON.parse(value) || {}
        : {};
    const variableIndices = getVariableIndices(rawText);
    const substitutedText = (0, helper_js_2.substituteVariables)(rawText, variables);
    const font = options?.font || (0, common_1.getDefaultFont)();
    const fontKitFont = await (0, helper_js_1.getFontKitFont)(schema.fontName, font, _cache);
    const textBlock = (0, uiRender_js_1.buildStyledTextContainer)(arg, fontKitFont, substitutedText);
    // Construct content-editable spans for each variable within the string
    let inVarString = false;
    for (let i = 0; i < rawText.length; i++) {
        if (variableIndices[i]) {
            inVarString = true;
            let span = document.createElement('span');
            span.style.outline = `${theme.colorPrimary} dashed 1px`;
            (0, uiRender_js_1.makeElementPlainTextContentEditable)(span);
            span.textContent = variables[variableIndices[i]];
            span.addEventListener('blur', (e) => {
                const newValue = e.target.textContent || '';
                if (newValue !== variables[variableIndices[i]]) {
                    variables[variableIndices[i]] = newValue;
                    if (onChange)
                        onChange({ key: 'content', value: JSON.stringify(variables) });
                    if (stopEditing)
                        stopEditing();
                }
            });
            textBlock.appendChild(span);
        }
        else if (inVarString) {
            if (rawText[i] === '}') {
                inVarString = false;
            }
        }
        else {
            let span = document.createElement('span');
            span.style.letterSpacing = rawText.length === i + 1 ? '0' : 'inherit';
            span.textContent = rawText[i];
            textBlock.appendChild(span);
        }
    }
};
const getVariableIndices = (content) => {
    const regex = /\{([^}]+)}/g;
    const indices = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        indices[match.index] = match[1];
    }
    return indices;
};
const countUniqueVariableNames = (content) => {
    const regex = /\{([^}]+)}/g;
    const uniqueMatchesSet = new Set();
    let match;
    while ((match = regex.exec(content)) !== null) {
        uniqueMatchesSet.add(match[1]);
    }
    return uniqueMatchesSet.size;
};
/**
 * An optimisation to try to minimise jank while typing.
 * Only check whether variables were modified based on certain key presses.
 * Regex would otherwise be performed on every key press (which isn't terrible, but this code helps).
 */
const keyPressShouldBeChecked = (event) => {
    if (event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight') {
        return false;
    }
    const selection = window.getSelection();
    const contenteditable = event.target;
    const isCursorAtEnd = selection?.focusOffset === contenteditable?.textContent?.length;
    if (isCursorAtEnd) {
        return event.key === '}' || event.key === 'Backspace' || event.key === 'Delete';
    }
    const isCursorAtStart = selection?.anchorOffset === 0;
    if (isCursorAtStart) {
        return event.key === '{' || event.key === 'Backspace' || event.key === 'Delete';
    }
    return true;
};
//# sourceMappingURL=uiRender.js.map