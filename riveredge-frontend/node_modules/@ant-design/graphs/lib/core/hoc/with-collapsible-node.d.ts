import type { Graph, NodeData } from '@antv/g6';
import React from 'react';
import type { CollapseExpandReactNodeOptions } from '../transform';
interface CollapsibleNodeProps extends CollapseExpandReactNodeOptions {
    /**
     * Node data
     */
    data: NodeData;
    /**
     * G6 Graph instance
     */
    graph: Graph;
}
export declare const withCollapsibleNode: (NodeComponent: React.FC) => (props: CollapsibleNodeProps) => React.JSX.Element;
export {};
