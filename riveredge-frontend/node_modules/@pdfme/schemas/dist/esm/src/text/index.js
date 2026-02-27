import { pdfRender } from './pdfRender.js';
import { propPanel } from './propPanel.js';
import { uiRender } from './uiRender.js';
import { TextCursorInput } from 'lucide';
import { createSvgStr } from '../utils.js';
const textSchema = {
    pdf: pdfRender,
    ui: uiRender,
    propPanel,
    icon: createSvgStr(TextCursorInput),
};
export default textSchema;
//# sourceMappingURL=index.js.map