"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
class PDFObject {
    clone(_context) {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'clone');
    }
    toString() {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'toString');
    }
    sizeInBytes() {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'sizeInBytes');
    }
    copyBytesInto(_buffer, _offset) {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'copyBytesInto');
    }
}
exports.default = PDFObject;
//# sourceMappingURL=PDFObject.js.map