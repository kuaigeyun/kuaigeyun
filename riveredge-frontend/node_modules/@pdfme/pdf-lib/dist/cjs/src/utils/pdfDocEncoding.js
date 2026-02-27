"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfDocEncodingDecode = void 0;
const strings_1 = require("./strings");
// Mapping from PDFDocEncoding to Unicode code point
const pdfDocEncodingToUnicode = new Uint16Array(256);
// Initialize the code points which are the same
for (let idx = 0; idx < 256; idx++) {
    pdfDocEncodingToUnicode[idx] = idx;
}
// Set differences (see "Table D.2 – PDFDocEncoding Character Set" of the PDF spec)
pdfDocEncodingToUnicode[0x16] = (0, strings_1.toCharCode)('\u0017'); // SYNCRONOUS IDLE
pdfDocEncodingToUnicode[0x18] = (0, strings_1.toCharCode)('\u02D8'); // BREVE
pdfDocEncodingToUnicode[0x19] = (0, strings_1.toCharCode)('\u02C7'); // CARON
pdfDocEncodingToUnicode[0x1a] = (0, strings_1.toCharCode)('\u02C6'); // MODIFIER LETTER CIRCUMFLEX ACCENT
pdfDocEncodingToUnicode[0x1b] = (0, strings_1.toCharCode)('\u02D9'); // DOT ABOVE
pdfDocEncodingToUnicode[0x1c] = (0, strings_1.toCharCode)('\u02DD'); // DOUBLE ACUTE ACCENT
pdfDocEncodingToUnicode[0x1d] = (0, strings_1.toCharCode)('\u02DB'); // OGONEK
pdfDocEncodingToUnicode[0x1e] = (0, strings_1.toCharCode)('\u02DA'); // RING ABOVE
pdfDocEncodingToUnicode[0x1f] = (0, strings_1.toCharCode)('\u02DC'); // SMALL TILDE
pdfDocEncodingToUnicode[0x7f] = (0, strings_1.toCharCode)('\uFFFD'); // REPLACEMENT CHARACTER (box with questionmark)
pdfDocEncodingToUnicode[0x80] = (0, strings_1.toCharCode)('\u2022'); // BULLET
pdfDocEncodingToUnicode[0x81] = (0, strings_1.toCharCode)('\u2020'); // DAGGER
pdfDocEncodingToUnicode[0x82] = (0, strings_1.toCharCode)('\u2021'); // DOUBLE DAGGER
pdfDocEncodingToUnicode[0x83] = (0, strings_1.toCharCode)('\u2026'); // HORIZONTAL ELLIPSIS
pdfDocEncodingToUnicode[0x84] = (0, strings_1.toCharCode)('\u2014'); // EM DASH
pdfDocEncodingToUnicode[0x85] = (0, strings_1.toCharCode)('\u2013'); // EN DASH
pdfDocEncodingToUnicode[0x86] = (0, strings_1.toCharCode)('\u0192'); // LATIN SMALL LETTER SCRIPT F
pdfDocEncodingToUnicode[0x87] = (0, strings_1.toCharCode)('\u2044'); // FRACTION SLASH (solidus)
pdfDocEncodingToUnicode[0x88] = (0, strings_1.toCharCode)('\u2039'); // SINGLE LEFT-POINTING ANGLE QUOTATION MARK
pdfDocEncodingToUnicode[0x89] = (0, strings_1.toCharCode)('\u203A'); // SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
pdfDocEncodingToUnicode[0x8a] = (0, strings_1.toCharCode)('\u2212'); // MINUS SIGN
pdfDocEncodingToUnicode[0x8b] = (0, strings_1.toCharCode)('\u2030'); // PER MILLE SIGN
pdfDocEncodingToUnicode[0x8c] = (0, strings_1.toCharCode)('\u201E'); // DOUBLE LOW-9 QUOTATION MARK (quotedblbase)
pdfDocEncodingToUnicode[0x8d] = (0, strings_1.toCharCode)('\u201C'); // LEFT DOUBLE QUOTATION MARK (quotedblleft)
pdfDocEncodingToUnicode[0x8e] = (0, strings_1.toCharCode)('\u201D'); // RIGHT DOUBLE QUOTATION MARK (quotedblright)
pdfDocEncodingToUnicode[0x8f] = (0, strings_1.toCharCode)('\u2018'); // LEFT SINGLE QUOTATION MARK (quoteleft)
pdfDocEncodingToUnicode[0x90] = (0, strings_1.toCharCode)('\u2019'); // RIGHT SINGLE QUOTATION MARK (quoteright)
pdfDocEncodingToUnicode[0x91] = (0, strings_1.toCharCode)('\u201A'); // SINGLE LOW-9 QUOTATION MARK (quotesinglbase)
pdfDocEncodingToUnicode[0x92] = (0, strings_1.toCharCode)('\u2122'); // TRADE MARK SIGN
pdfDocEncodingToUnicode[0x93] = (0, strings_1.toCharCode)('\uFB01'); // LATIN SMALL LIGATURE FI
pdfDocEncodingToUnicode[0x94] = (0, strings_1.toCharCode)('\uFB02'); // LATIN SMALL LIGATURE FL
pdfDocEncodingToUnicode[0x95] = (0, strings_1.toCharCode)('\u0141'); // LATIN CAPITAL LETTER L WITH STROKE
pdfDocEncodingToUnicode[0x96] = (0, strings_1.toCharCode)('\u0152'); // LATIN CAPITAL LIGATURE OE
pdfDocEncodingToUnicode[0x97] = (0, strings_1.toCharCode)('\u0160'); // LATIN CAPITAL LETTER S WITH CARON
pdfDocEncodingToUnicode[0x98] = (0, strings_1.toCharCode)('\u0178'); // LATIN CAPITAL LETTER Y WITH DIAERESIS
pdfDocEncodingToUnicode[0x99] = (0, strings_1.toCharCode)('\u017D'); // LATIN CAPITAL LETTER Z WITH CARON
pdfDocEncodingToUnicode[0x9a] = (0, strings_1.toCharCode)('\u0131'); // LATIN SMALL LETTER DOTLESS I
pdfDocEncodingToUnicode[0x9b] = (0, strings_1.toCharCode)('\u0142'); // LATIN SMALL LETTER L WITH STROKE
pdfDocEncodingToUnicode[0x9c] = (0, strings_1.toCharCode)('\u0153'); // LATIN SMALL LIGATURE OE
pdfDocEncodingToUnicode[0x9d] = (0, strings_1.toCharCode)('\u0161'); // LATIN SMALL LETTER S WITH CARON
pdfDocEncodingToUnicode[0x9e] = (0, strings_1.toCharCode)('\u017E'); // LATIN SMALL LETTER Z WITH CARON
pdfDocEncodingToUnicode[0x9f] = (0, strings_1.toCharCode)('\uFFFD'); // REPLACEMENT CHARACTER (box with questionmark)
pdfDocEncodingToUnicode[0xa0] = (0, strings_1.toCharCode)('\u20AC'); // EURO SIGN
pdfDocEncodingToUnicode[0xad] = (0, strings_1.toCharCode)('\uFFFD'); // REPLACEMENT CHARACTER (box with questionmark)
/**
 * Decode a byte array into a string using PDFDocEncoding.
 *
 * @param bytes a byte array (decimal representation) containing a string
 *              encoded with PDFDocEncoding.
 */
const pdfDocEncodingDecode = (bytes) => {
    const codePoints = new Array(bytes.length);
    for (let idx = 0, len = bytes.length; idx < len; idx++) {
        codePoints[idx] = pdfDocEncodingToUnicode[bytes[idx]];
    }
    return String.fromCodePoint(...codePoints);
};
exports.pdfDocEncodingDecode = pdfDocEncodingDecode;
//# sourceMappingURL=pdfDocEncoding.js.map