import { Plugin, Schema } from '@pdfme/common';
interface Checkbox extends Schema {
    color: string;
}
declare const schema: Plugin<Checkbox>;
export default schema;
