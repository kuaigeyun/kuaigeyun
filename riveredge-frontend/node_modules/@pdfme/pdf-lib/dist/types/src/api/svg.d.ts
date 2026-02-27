import { HTMLElement } from 'node-html-better-parser';
import { Color } from './colors';
import { Degrees } from './rotations';
import PDFPage from './PDFPage';
import { PDFPageDrawSVGElementOptions } from './PDFPageOptions';
import { LineCapStyle, LineJoinStyle, FillRule } from './operators';
import { TransformationMatrix } from '../types/matrix';
import { Space } from '../types';
interface Position {
    x: number;
    y: number;
}
interface Size {
    width: number;
    height: number;
}
type Box = Position & Size;
type InheritedAttributes = {
    width: number;
    height: number;
    fill?: Color;
    fillOpacity?: number;
    stroke?: Color;
    strokeWidth?: number;
    strokeOpacity?: number;
    strokeLineCap?: LineCapStyle;
    fillRule?: FillRule;
    strokeLineJoin?: LineJoinStyle;
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: string;
    fontSize?: number;
    rotation?: Degrees;
    viewBox: Box;
};
type SVGAttributes = {
    rotate?: Degrees;
    scale?: number;
    skewX?: Degrees;
    skewY?: Degrees;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    r?: number;
    rx?: number;
    ry?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    d?: string;
    src?: string;
    textAnchor?: string;
    preserveAspectRatio?: string;
    strokeWidth?: number;
    dominantBaseline?: string;
    points?: string;
};
type TransformAttributes = {
    matrix: TransformationMatrix;
    clipSpaces: Space[];
};
export type SVGElement = HTMLElement & {
    svgAttributes: InheritedAttributes & SVGAttributes & TransformAttributes;
};
export declare const drawSvg: (page: PDFPage, svg: string, options: PDFPageDrawSVGElementOptions) => Promise<void>;
export {};
