"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapVerticalAlignToFlex = exports.makeElementPlainTextContentEditable = exports.buildStyledTextContainer = exports.uiRender = void 0;
const common_1 = require("@pdfme/common");
const constants_js_1 = require("./constants.js");
const helper_js_1 = require("./helper.js");
const utils_js_1 = require("../utils.js");
const replaceUnsupportedChars = (text, fontKitFont) => {
    const charSupportCache = {};
    const isCharSupported = (char) => {
        if (char in charSupportCache) {
            return charSupportCache[char];
        }
        const isSupported = fontKitFont.hasGlyphForCodePoint(char.codePointAt(0) || 0);
        charSupportCache[char] = isSupported;
        return isSupported;
    };
    const segments = text.split(/(\r\n|\n|\r)/);
    return segments
        .map((segment) => {
        if (/\r\n|\n|\r/.test(segment)) {
            return segment;
        }
        return segment
            .split('')
            .map((char) => {
            if (/\s/.test(char) || char.charCodeAt(0) < 32) {
                return char;
            }
            return isCharSupported(char) ? char : '〿';
        })
            .join('');
    })
        .join('');
};
const uiRender = async (arg) => {
    const { value, schema, mode, onChange, stopEditing, tabIndex, placeholder, options, _cache } = arg;
    const usePlaceholder = (0, utils_js_1.isEditable)(mode, schema) && placeholder && !value;
    const getText = (element) => {
        let text = element.innerText;
        if (text.endsWith('\n')) {
            // contenteditable adds additional newline char retrieved with innerText
            text = text.slice(0, -1);
        }
        return text;
    };
    const font = options?.font || (0, common_1.getDefaultFont)();
    const fontKitFont = await (0, helper_js_1.getFontKitFont)(schema.fontName, font, _cache);
    const textBlock = (0, exports.buildStyledTextContainer)(arg, fontKitFont, usePlaceholder ? placeholder : value);
    const processedText = replaceUnsupportedChars(value, fontKitFont);
    if (!(0, utils_js_1.isEditable)(mode, schema)) {
        // Read-only mode
        textBlock.innerHTML = processedText
            .split('')
            .map((l, i) => `<span style="letter-spacing:${String(value).length === i + 1 ? 0 : 'inherit'};">${l}</span>`)
            .join('');
        return;
    }
    (0, exports.makeElementPlainTextContentEditable)(textBlock);
    textBlock.tabIndex = tabIndex || 0;
    textBlock.innerText = mode === 'designer' ? value : processedText;
    textBlock.addEventListener('blur', (e) => {
        if (onChange)
            onChange({ key: 'content', value: getText(e.target) });
        if (stopEditing)
            stopEditing();
    });
    if (schema.dynamicFontSize) {
        let dynamicFontSize = undefined;
        textBlock.addEventListener('keyup', () => {
            setTimeout(() => {
                // Use a regular function instead of an async one since we don't need await
                (() => {
                    if (!textBlock.textContent)
                        return;
                    dynamicFontSize = (0, helper_js_1.calculateDynamicFontSize)({
                        textSchema: schema,
                        fontKitFont,
                        value: getText(textBlock),
                        startingFontSize: dynamicFontSize,
                    });
                    textBlock.style.fontSize = `${dynamicFontSize}pt`;
                    const { topAdj: newTopAdj, bottomAdj: newBottomAdj } = (0, helper_js_1.getBrowserVerticalFontAdjustments)(fontKitFont, dynamicFontSize ?? schema.fontSize ?? constants_js_1.DEFAULT_FONT_SIZE, schema.lineHeight ?? constants_js_1.DEFAULT_LINE_HEIGHT, schema.verticalAlignment ?? constants_js_1.DEFAULT_VERTICAL_ALIGNMENT);
                    textBlock.style.paddingTop = `${newTopAdj}px`;
                    textBlock.style.marginBottom = `${newBottomAdj}px`;
                })();
            }, 0);
        });
    }
    if (usePlaceholder) {
        textBlock.style.color = constants_js_1.PLACEHOLDER_FONT_COLOR;
        textBlock.addEventListener('focus', () => {
            if (textBlock.innerText === placeholder) {
                textBlock.innerText = '';
                textBlock.style.color = schema.fontColor ?? constants_js_1.DEFAULT_FONT_COLOR;
            }
        });
    }
    if (mode === 'designer') {
        setTimeout(() => {
            textBlock.focus();
            // Set the focus to the end of the editable element when you focus, as we would for a textarea
            const selection = window.getSelection();
            const range = document.createRange();
            if (selection && range) {
                range.selectNodeContents(textBlock);
                range.collapse(false); // Collapse range to the end
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        });
    }
};
exports.uiRender = uiRender;
const buildStyledTextContainer = (arg, fontKitFont, value) => {
    const { schema, rootElement, mode } = arg;
    let dynamicFontSize = undefined;
    if (schema.dynamicFontSize && value) {
        dynamicFontSize = (0, helper_js_1.calculateDynamicFontSize)({
            textSchema: schema,
            fontKitFont,
            value,
            startingFontSize: dynamicFontSize,
        });
    }
    // Depending on vertical alignment, we need to move the top or bottom of the font to keep
    // it within it's defined box and align it with the generated pdf.
    const { topAdj, bottomAdj } = (0, helper_js_1.getBrowserVerticalFontAdjustments)(fontKitFont, dynamicFontSize ?? schema.fontSize ?? constants_js_1.DEFAULT_FONT_SIZE, schema.lineHeight ?? constants_js_1.DEFAULT_LINE_HEIGHT, schema.verticalAlignment ?? constants_js_1.DEFAULT_VERTICAL_ALIGNMENT);
    const topAdjustment = topAdj.toString();
    const bottomAdjustment = bottomAdj.toString();
    const container = document.createElement('div');
    const containerStyle = {
        padding: 0,
        resize: 'none',
        backgroundColor: getBackgroundColor(value, schema),
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: (0, exports.mapVerticalAlignToFlex)(schema.verticalAlignment),
        width: '100%',
        height: '100%',
        cursor: (0, utils_js_1.isEditable)(mode, schema) ? 'text' : 'default',
    };
    Object.assign(container.style, containerStyle);
    rootElement.innerHTML = '';
    rootElement.appendChild(container);
    // text decoration
    const textDecorations = [];
    if (schema.strikethrough)
        textDecorations.push('line-through');
    if (schema.underline)
        textDecorations.push('underline');
    const textBlockStyle = {
        // Font formatting styles
        fontFamily: schema.fontName ? `'${schema.fontName}'` : 'inherit',
        color: schema.fontColor ? schema.fontColor : constants_js_1.DEFAULT_FONT_COLOR,
        fontSize: `${dynamicFontSize ?? schema.fontSize ?? constants_js_1.DEFAULT_FONT_SIZE}pt`,
        letterSpacing: `${schema.characterSpacing ?? constants_js_1.DEFAULT_CHARACTER_SPACING}pt`,
        lineHeight: `${schema.lineHeight ?? constants_js_1.DEFAULT_LINE_HEIGHT}em`,
        textAlign: schema.alignment ?? constants_js_1.DEFAULT_ALIGNMENT,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        // Block layout styles
        resize: 'none',
        border: 'none',
        outline: 'none',
        marginBottom: `${bottomAdjustment}px`,
        paddingTop: `${topAdjustment}px`,
        backgroundColor: 'transparent',
        textDecoration: textDecorations.join(' '),
    };
    const textBlock = document.createElement('div');
    textBlock.id = 'text-' + String(schema.id);
    Object.assign(textBlock.style, textBlockStyle);
    container.appendChild(textBlock);
    return textBlock;
};
exports.buildStyledTextContainer = buildStyledTextContainer;
/**
 * Firefox doesn't support 'plaintext-only' contentEditable mode, which we want to avoid mark-up.
 * This function adds a workaround for Firefox to make the contentEditable element behave like 'plaintext-only'.
 */
const makeElementPlainTextContentEditable = (element) => {
    if (!(0, helper_js_1.isFirefox)()) {
        element.contentEditable = 'plaintext-only';
        return;
    }
    element.contentEditable = 'true';
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertLineBreak', false, undefined);
        }
    });
    element.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = e.clipboardData?.getData('text');
        const selection = window.getSelection();
        if (!selection?.rangeCount)
            return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(paste || ''));
        selection.collapseToEnd();
    });
};
exports.makeElementPlainTextContentEditable = makeElementPlainTextContentEditable;
const mapVerticalAlignToFlex = (verticalAlignmentValue) => {
    switch (verticalAlignmentValue) {
        case constants_js_1.VERTICAL_ALIGN_TOP:
            return 'flex-start';
        case constants_js_1.VERTICAL_ALIGN_MIDDLE:
            return 'center';
        case constants_js_1.VERTICAL_ALIGN_BOTTOM:
            return 'flex-end';
    }
    return 'flex-start';
};
exports.mapVerticalAlignToFlex = mapVerticalAlignToFlex;
const getBackgroundColor = (value, schema) => {
    if (!value || !schema.backgroundColor)
        return 'transparent';
    return schema.backgroundColor;
};
//# sourceMappingURL=uiRender.js.map