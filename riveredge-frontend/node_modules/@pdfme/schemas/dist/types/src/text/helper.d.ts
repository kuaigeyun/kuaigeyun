import * as fontkit from 'fontkit';
import type { Font as FontKitFont } from 'fontkit';
import { Font } from '@pdfme/common';
import type { TextSchema, FontWidthCalcValues } from './types.js';
export declare const getBrowserVerticalFontAdjustments: (fontKitFont: FontKitFont, fontSize: number, lineHeight: number, verticalAlignment: string) => {
    topAdj: number;
    bottomAdj: number;
};
export declare const getFontDescentInPt: (fontKitFont: FontKitFont, fontSize: number) => number;
export declare const heightOfFontAtSize: (fontKitFont: FontKitFont, fontSize: number) => number;
export declare const widthOfTextAtSize: (text: string, fontKitFont: FontKitFont, fontSize: number, characterSpacing: number) => number;
export declare const getFontKitFont: (fontName: string | undefined, font: Font, _cache: Map<string | number, fontkit.Font>) => Promise<fontkit.Font>;
/**
 * Recursively splits the line at getSplitPosition.
 * If there is some leftover, split the rest again in the same manner.
 */
export declare const getSplittedLines: (textLine: string, calcValues: FontWidthCalcValues) => string[];
/**
 * If using dynamic font size, iteratively increment or decrement the
 * font size to fit the containing box.
 * Calculating space usage involves splitting lines where they exceed
 * the box width based on the proposed size.
 */
export declare const calculateDynamicFontSize: ({ textSchema, fontKitFont, value, startingFontSize, }: {
    textSchema: TextSchema;
    fontKitFont: FontKitFont;
    value: string;
    startingFontSize?: number | undefined;
}) => number;
export declare const splitTextToSize: (arg: {
    value: string;
    characterSpacing: number;
    boxWidthInPt: number;
    fontSize: number;
    fontKitFont: fontkit.Font;
}) => string[];
export declare const isFirefox: () => boolean;
export declare const filterStartJP: (lines: string[]) => string[];
export declare const filterEndJP: (lines: string[]) => string[];
