import type { Schema, Plugin } from '@pdfme/common';
interface LineSchema extends Schema {
    color: string;
}
declare const lineSchema: Plugin<LineSchema>;
export default lineSchema;
