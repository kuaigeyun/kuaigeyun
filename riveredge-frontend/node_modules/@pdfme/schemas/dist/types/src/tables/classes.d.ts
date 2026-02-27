import { Font } from '@pdfme/common';
import type { Font as FontKitFont } from 'fontkit';
import type { Styles, TableInput, Settings, Section, StylesProps } from './types.js';
type ContentSettings = {
    body: Row[];
    head: Row[];
    columns: Column[];
};
export declare class Cell {
    raw: string;
    text: string[];
    styles: Styles;
    section: Section;
    contentHeight: number;
    contentWidth: number;
    wrappedWidth: number;
    minReadableWidth: number;
    minWidth: number;
    width: number;
    height: number;
    x: number;
    y: number;
    constructor(raw: string, styles: Styles, section: Section);
    getContentHeight(): number;
    padding(name: 'top' | 'bottom' | 'left' | 'right'): number;
}
export declare class Column {
    index: number;
    wrappedWidth: number;
    minReadableWidth: number;
    minWidth: number;
    width: number;
    constructor(index: number);
    getMaxCustomCellWidth(table: Table): number;
}
export declare class Row {
    readonly raw: string[];
    readonly index: number;
    readonly section: Section;
    readonly cells: {
        [key: string]: Cell;
    };
    height: number;
    constructor(raw: string[], index: number, section: Section, cells: {
        [key: string]: Cell;
    });
    getMaxCellHeight(columns: Column[]): number;
    getMinimumRowHeight(columns: Column[]): number;
}
export declare class Table {
    readonly settings: Settings;
    readonly styles: StylesProps;
    readonly columns: Column[];
    readonly head: Row[];
    readonly body: Row[];
    constructor(input: TableInput, content: ContentSettings);
    static create(arg: {
        input: TableInput;
        content: ContentSettings;
        font: Font;
        _cache: Map<string | number, FontKitFont>;
    }): Promise<Table>;
    getHeadHeight(): number;
    getBodyHeight(): number;
    allRows(): Row[];
    getWidth(): number;
    getHeight(): number;
}
export {};
