import type { Graph, NodeData } from '@antv/g6';
import React, { FC } from 'react';
interface ArrowCountIconProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
    /**
     * The placement of the icon
     */
    placement?: 'top' | 'right' | 'bottom' | 'left';
    /**
     * G6 Graph instance
     */
    graph: Graph;
    /**
     * Node data
     */
    data: NodeData;
    /**
     * Whether the node is collapsed
     */
    isCollapsed: boolean;
    /**
     * Determines the count to show when the node is collapsed
     */
    countType?: 'descendant' | 'children';
}
export declare const ArrowCountIcon: FC<ArrowCountIconProps>;
export {};
