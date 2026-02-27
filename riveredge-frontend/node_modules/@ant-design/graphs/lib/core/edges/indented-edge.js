"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndentedEdge = void 0;
const g6_1 = require("@antv/g6");
class IndentedEdge extends g6_1.Polyline {
    getControlPoints(attributes) {
        const [sourcePoint, targetPoint] = this.getEndpoints(attributes, false);
        const [sx] = sourcePoint;
        const [, ty] = targetPoint;
        return [[sx, ty]];
    }
}
exports.IndentedEdge = IndentedEdge;
