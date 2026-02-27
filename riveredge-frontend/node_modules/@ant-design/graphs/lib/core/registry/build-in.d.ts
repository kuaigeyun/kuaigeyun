import { ReactNode } from '@antv/g6-extension-react';
import { HoverActivateChain, HoverActivateNeighbors } from '../behaviors';
import { IndentedEdge } from '../edges';
import { ArrangeEdgeZIndex, AssignColorByBranch, CollapseExpandReactNode, MapEdgeLineWidth, TranslateReactNodeOrigin } from '../transform';
export declare const BUILT_IN_EXTENSIONS: {
    node: {
        react: typeof ReactNode;
    };
    edge: {
        indented: typeof IndentedEdge;
    };
    behavior: {
        'hover-activate-neighbors': typeof HoverActivateNeighbors;
        'hover-activate-chain': typeof HoverActivateChain;
    };
    transform: {
        'translate-react-node-origin': typeof TranslateReactNodeOrigin;
        'collapse-expand-react-node': typeof CollapseExpandReactNode;
        'assign-color-by-branch': typeof AssignColorByBranch;
        'map-edge-line-width': typeof MapEdgeLineWidth;
        'arrange-edge-z-index': typeof ArrangeEdgeZIndex;
    };
};
