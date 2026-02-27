import { pdfRender } from './pdfRender.js';
import { propPanel } from './propPanel.js';
import { uiRender } from './uiRender.js';
import { Type } from 'lucide';
import { createSvgStr } from '../utils.js';
const schema = {
    pdf: pdfRender,
    ui: uiRender,
    propPanel,
    icon: createSvgStr(Type),
    uninterruptedEditMode: true,
};
export default schema;
//# sourceMappingURL=index.js.map