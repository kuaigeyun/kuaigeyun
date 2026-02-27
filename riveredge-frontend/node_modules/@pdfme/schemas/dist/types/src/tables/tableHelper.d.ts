import { Schema, BasePdf, CommonOptions } from '@pdfme/common';
import { Table } from './classes.js';
interface CreateTableArgs {
    schema: Schema;
    basePdf: BasePdf;
    options: CommonOptions;
    _cache: Map<string | number, unknown>;
}
export declare function createSingleTable(body: string[][], args: CreateTableArgs): Promise<Table>;
export {};
