import { FontNames } from '@pdf-lib/standard-fonts';
export const values = (obj) => Object.keys(obj).map((k) => obj[k]);
export const StandardFontValues = values(FontNames);
export const isStandardFont = (input) => StandardFontValues.includes(input);
export const rectanglesAreEqual = (a, b) => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
//# sourceMappingURL=objects.js.map