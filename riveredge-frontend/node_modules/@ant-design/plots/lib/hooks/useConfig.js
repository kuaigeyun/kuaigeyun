"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useConfig;
var react_1 = require("react");
var context_1 = require("../context");
function useConfig() {
    return (0, react_1.useContext)(context_1.ConfigContext);
}
