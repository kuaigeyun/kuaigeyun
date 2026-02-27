"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfRender = void 0;
const pdfRender_js_1 = require("../text/pdfRender.js");
const helper_js_1 = require("./helper.js");
const pdfRender = async (arg) => {
    const { value, schema, ...rest } = arg;
    if (!(0, helper_js_1.validateVariables)(value, schema)) {
        // Don't render if a required variable is missing
        return;
    }
    const renderArgs = {
        value: (0, helper_js_1.substituteVariables)(schema.text || '', value),
        schema,
        ...rest,
    };
    await (0, pdfRender_js_1.pdfRender)(renderArgs);
};
exports.pdfRender = pdfRender;
//# sourceMappingURL=pdfRender.js.map