import type { Graph, NodeData } from '@antv/g6';
/**
 * Get the side of the node relative to the reference node
 * @param nodeData - Node data
 * @param parentData - Reference node data
 * @returns The side of the node relative to the reference node
 */
export declare const getRelativeSide: ((nodeData: NodeData, refNodeData?: NodeData) => "center" | "left" | "right") & import("lodash").MemoizedFunction;
/**
 * Get the side of the node relative to the parent node
 * @param graph - Graph instance
 * @param data - Node data
 * @returns The side of the node relative to the parent node
 */
export declare const getNodeSide: (graph: Graph, data: NodeData) => "center" | "left" | "right";
/**
 * Whether the node is a leaf node
 * @param nodeData - node data
 * @returns Whether the node is a leaf node
 */
export declare const isLeafNode: (nodeData: NodeData) => boolean;
