"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBuiltInExtensions = registerBuiltInExtensions;
const g6_1 = require("@antv/g6");
const build_in_1 = require("./build-in");
function registerBuiltInExtensions() {
    Object.entries(build_in_1.BUILT_IN_EXTENSIONS).forEach(([category, extensions]) => {
        Object.entries(extensions).forEach(([type, extension]) => {
            (0, g6_1.register)(category, type, extension);
        });
    });
}
