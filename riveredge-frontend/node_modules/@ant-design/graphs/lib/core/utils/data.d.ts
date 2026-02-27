import type { EdgeData, EdgeDirection, GraphData, ID, TreeData } from '@antv/g6';
/**
 * 获取邻居节点
 * @param nodeId - 节点 ID
 * @param edges - 边数据
 * @param direction - 边的方向
 * @returns 邻居节点 ID
 */
export declare const getNeighborNodeIds: (nodeId: ID, edges: EdgeData[], direction: EdgeDirection) => ID[];
/**
 * 检查给定的数据是否是有效的树图结构
 * @param data - 数据
 * @returns 如果数据是有效的树图结构，则返回 true；否则返回 false
 */
export declare function isTreeData(data: any): data is TreeData;
/**
 * 检查给定的数据是否是有效的图结构
 * @param data - 数据
 * @returns 如果数据是有效的图结构，则返回 true；否则返回 false
 */
export declare function isGraphData(data: GraphData | TreeData): data is GraphData;
/**
 * 将图数据转换为树图数据
 * @param data - 图数据
 * @returns 树图数据
 */
export declare function graphData2TreeData(data: GraphData): TreeData | undefined;
/**
 * 将树图数据转换为图数据
 * @param data - 树图数据
 * @param defaultExpandLevel - 默认展开层级。若不传入，则所有节点均展开
 * @returns 图数据
 */
export declare function treeData2GraphData(data: TreeData, defaultExpandLevel?: number): GraphData;
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
export declare function formatTreeData(data?: GraphData | TreeData, defaultExpandLevel?: number): GraphData;
