import { treeToGraphData } from '@antv/g6';
/**
 * 获取邻居节点
 * @param nodeId - 节点 ID
 * @param edges - 边数据
 * @param direction - 边的方向
 * @returns 邻居节点 ID
 */
export const getNeighborNodeIds = (nodeId, edges, direction) => {
    const getSuccessorNodeIds = (reverse = false) => {
        const [source, target] = reverse ? ['target', 'source'] : ['source', 'target'];
        return edges.filter((edge) => edge[source] === nodeId).map((edge) => edge[target]);
    };
    if (direction === 'out')
        return getSuccessorNodeIds();
    if (direction === 'in')
        return getSuccessorNodeIds(true);
    return getSuccessorNodeIds().concat(getSuccessorNodeIds(true));
};
const EMPTY_GRAPH_DATA = { nodes: [], edges: [] };
/**
 * 检查给定的数据是否是有效的树图结构
 * @param data - 数据
 * @returns 如果数据是有效的树图结构，则返回 true；否则返回 false
 */
export function isTreeData(data) {
    if (typeof data !== 'object' || data === null)
        return false;
    if (!('id' in data))
        return false;
    if ('children' in data) {
        if (!Array.isArray(data.children))
            return false;
        for (const child of data.children) {
            if (!isTreeData(child))
                return false;
        }
    }
    return true;
}
/**
 * 检查给定的数据是否是有效的图结构
 * @param data - 数据
 * @returns 如果数据是有效的图结构，则返回 true；否则返回 false
 */
export function isGraphData(data) {
    if (typeof data !== 'object' || data === null)
        return false;
    if (!Object.keys(data).every((key) => ['nodes', 'edges', 'combos'].includes(key))) {
        return false;
    }
    const { nodes = [], edges = [], combos = [] } = data;
    if (!Array.isArray(nodes) || !Array.isArray(edges) || !Array.isArray(combos)) {
        return false;
    }
    const nodeIds = new Set(nodes.map((node) => node.id));
    if (!nodes.every((node) => typeof node === 'object' && node !== null && 'id' in node)) {
        return false;
    }
    if (!edges.every((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))) {
        return false;
    }
    return true;
}
/**
 * 将图数据转换为树图数据
 * @param data - 图数据
 * @returns 树图数据
 */
export function graphData2TreeData(data) {
    if (!isGraphData(data)) {
        return;
    }
    const { nodes = [], edges = [] } = data;
    const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const indegree = Object.fromEntries(nodes.map((node) => [node.id, 0]));
    const adjList = Object.fromEntries(nodes.map((node) => [node.id, []]));
    for (const { source, target } of edges) {
        adjList[source].push(target);
        indegree[target] = (indegree[target] || 0) + 1;
    }
    const roots = Object.entries(indegree)
        .filter(([_, deg]) => deg === 0)
        .map(([id]) => id);
    if (roots.length !== 1) {
        return;
    }
    const buildTree = (nodeId) => {
        const node = nodeMap[nodeId];
        return {
            ...node,
            children: adjList[nodeId].map(buildTree),
        };
    };
    return buildTree(roots[0]);
}
/**
 * 将树图数据转换为图数据
 * @param data - 树图数据
 * @param defaultExpandLevel - 默认展开层级。若不传入，则所有节点均展开
 * @returns 图数据
 */
export function treeData2GraphData(data, defaultExpandLevel) {
    if (!isTreeData(data))
        return EMPTY_GRAPH_DATA;
    return treeToGraphData(data, {
        getNodeData: (datum, depth) => {
            datum.depth = depth;
            datum.style ||= {};
            if (defaultExpandLevel) {
                datum.style.collapsed = depth >= defaultExpandLevel;
            }
            if (!datum.children)
                return datum;
            const { children, ...restDatum } = datum;
            return { ...restDatum, children: children.map((child) => child.id) };
        },
    });
}
/**
 * Used in TreeGraph scene, accepts tree data or graph data that meets certain conditions
 *
 * Conditions are as follows:
 * 1. There is only one root node
 * 2. Node ID is unique
 * 3. The source and target of the edge are in the node ID
 * 4. No cycle
 * 5. The indegree of the child node is 1
 */
export function formatTreeData(data, defaultExpandLevel) {
    if (!data)
        return EMPTY_GRAPH_DATA;
    const treeData = isGraphData(data) ? graphData2TreeData(data) : data;
    if (!treeData)
        return EMPTY_GRAPH_DATA;
    return treeData2GraphData(treeData, defaultExpandLevel);
}
