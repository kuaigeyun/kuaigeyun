import { Plugin, Schema } from '@pdfme/common';
interface RadioGroup extends Schema {
    group: string;
    color: string;
}
declare const schema: Plugin<RadioGroup>;
export default schema;
