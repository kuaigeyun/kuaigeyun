"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrangeEdgeZIndex = void 0;
const g6_1 = require("@antv/g6");
/**
 * ArrangeEdgeZIndex transform, specifically for indented tree layout
 */
class ArrangeEdgeZIndex extends g6_1.BaseTransform {
    beforeDraw(input) {
        const { model } = this.context;
        const { nodes, edges } = model.getData();
        const oneLevelNodes = nodes.filter((node) => node.depth === 1);
        const oneLevelNodeIds = oneLevelNodes.map((node) => node.id);
        edges.forEach((edge) => {
            if (oneLevelNodeIds.includes(edge.target)) {
                edge.style ||= {};
                edge.style.zIndex = oneLevelNodes.length - oneLevelNodes.findIndex((node) => node.id === edge.target);
            }
        });
        return input;
    }
}
exports.ArrangeEdgeZIndex = ArrangeEdgeZIndex;
