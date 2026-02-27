"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tiny = void 0;
var line_1 = __importDefault(require("./line"));
var area_1 = __importDefault(require("./area"));
var column_1 = __importDefault(require("./column"));
var progress_1 = __importDefault(require("./progress"));
var ring_1 = __importDefault(require("./ring"));
exports.Tiny = { Line: line_1.default, Area: area_1.default, Column: column_1.default, Progress: progress_1.default, Ring: ring_1.default };
