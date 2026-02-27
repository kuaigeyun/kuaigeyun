"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILT_IN_EXTENSIONS = void 0;
const g6_extension_react_1 = require("@antv/g6-extension-react");
const behaviors_1 = require("../behaviors");
const edges_1 = require("../edges");
const transform_1 = require("../transform");
exports.BUILT_IN_EXTENSIONS = {
    node: {
        react: g6_extension_react_1.ReactNode,
    },
    edge: {
        indented: edges_1.IndentedEdge,
    },
    behavior: {
        'hover-activate-neighbors': behaviors_1.HoverActivateNeighbors,
        'hover-activate-chain': behaviors_1.HoverActivateChain,
    },
    transform: {
        'translate-react-node-origin': transform_1.TranslateReactNodeOrigin,
        'collapse-expand-react-node': transform_1.CollapseExpandReactNode,
        'assign-color-by-branch': transform_1.AssignColorByBranch,
        'map-edge-line-width': transform_1.MapEdgeLineWidth,
        'arrange-edge-z-index': transform_1.ArrangeEdgeZIndex,
    },
};
