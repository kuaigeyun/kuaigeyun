import { Glyph } from '../../types/fontkit';
/** `glyphs` should be an array of unique glyphs */
export declare const createCmap: (glyphs: Glyph[], glyphId: (g?: Glyph) => number) => string;
