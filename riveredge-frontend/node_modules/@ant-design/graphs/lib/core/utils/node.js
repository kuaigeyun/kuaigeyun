"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLeafNode = exports.getNodeSide = exports.getRelativeSide = void 0;
const g6_1 = require("@antv/g6");
const lodash_1 = require("lodash");
/**
 * Get the side of the node relative to the reference node
 * @param nodeData - Node data
 * @param parentData - Reference node data
 * @returns The side of the node relative to the reference node
 */
exports.getRelativeSide = (0, lodash_1.memoize)((nodeData, refNodeData) => {
    if (!refNodeData)
        return 'center';
    const nodePositionX = (0, g6_1.positionOf)(nodeData)[0];
    const refNodePositionX = (0, g6_1.positionOf)(refNodeData)[0];
    return refNodePositionX > nodePositionX ? 'left' : 'right';
}, (nodeData, refNodeData) => refNodeData ? [(0, g6_1.positionOf)(nodeData), (0, g6_1.positionOf)(refNodeData)].flat().join('-') : 'center');
/**
 * Get the side of the node relative to the parent node
 * @param graph - Graph instance
 * @param data - Node data
 * @returns The side of the node relative to the parent node
 */
const getNodeSide = (graph, data) => {
    const parentData = graph.getParentData((0, g6_1.idOf)(data), 'tree');
    return (0, exports.getRelativeSide)(data, parentData);
};
exports.getNodeSide = getNodeSide;
/**
 * Whether the node is a leaf node
 * @param nodeData - node data
 * @returns Whether the node is a leaf node
 */
const isLeafNode = (nodeData) => {
    return !nodeData.children || nodeData.children.length === 0;
};
exports.isLeafNode = isLeafNode;
