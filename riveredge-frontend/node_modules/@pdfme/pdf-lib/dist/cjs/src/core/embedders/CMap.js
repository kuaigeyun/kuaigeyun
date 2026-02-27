"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCmap = void 0;
const utils_1 = require("../../utils");
const unicode_1 = require("../../utils/unicode");
/** `glyphs` should be an array of unique glyphs */
const createCmap = (glyphs, glyphId) => {
    const bfChars = new Array(glyphs.length);
    for (let idx = 0, len = glyphs.length; idx < len; idx++) {
        const glyph = glyphs[idx];
        const id = cmapHexFormat(cmapHexString(glyphId(glyph)));
        const unicode = cmapHexFormat(...glyph.codePoints.map(cmapCodePointFormat));
        bfChars[idx] = [id, unicode];
    }
    return fillCmapTemplate(bfChars);
};
exports.createCmap = createCmap;
/* =============================== Templates ================================ */
const fillCmapTemplate = (bfChars) => `\
/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo <<
  /Registry (Adobe)
  /Ordering (UCS)
  /Supplement 0
>> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000><ffff>
endcodespacerange
${bfChars.length} beginbfchar
${bfChars.map(([glyphId, codePoint]) => `${glyphId} ${codePoint}`).join('\n')}
endbfchar
endcmap
CMapName currentdict /CMap defineresource pop
end
end\
`;
/* =============================== Utilities ================================ */
const cmapHexFormat = (...values) => `<${values.join('')}>`;
const cmapHexString = (value) => (0, utils_1.toHexStringOfMinLength)(value, 4);
const cmapCodePointFormat = (codePoint) => {
    if ((0, unicode_1.isWithinBMP)(codePoint))
        return cmapHexString(codePoint);
    if ((0, unicode_1.hasSurrogates)(codePoint)) {
        const hs = (0, unicode_1.highSurrogate)(codePoint);
        const ls = (0, unicode_1.lowSurrogate)(codePoint);
        return `${cmapHexString(hs)}${cmapHexString(ls)}`;
    }
    const hex = (0, utils_1.toHexString)(codePoint);
    const msg = `0x${hex} is not a valid UTF-8 or UTF-16 codepoint.`;
    throw new Error(msg);
};
//# sourceMappingURL=CMap.js.map