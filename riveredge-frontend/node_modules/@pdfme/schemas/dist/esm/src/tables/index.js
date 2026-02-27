import { pdfRender } from './pdfRender.js';
import { uiRender } from './uiRender.js';
import { propPanel } from './propPanel.js';
import { Table } from 'lucide';
import { createSvgStr } from '../utils.js';
const tableSchema = {
    pdf: pdfRender,
    ui: uiRender,
    propPanel,
    icon: createSvgStr(Table),
};
export default tableSchema;
//# sourceMappingURL=index.js.map