"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignColorByBranch = void 0;
const g6_1 = require("@antv/g6");
class AssignColorByBranch extends g6_1.BaseTransform {
    static defaultOptions = {
        colors: [
            '#1783FF',
            '#F08F56',
            '#D580FF',
            '#00C9C9',
            '#7863FF',
            '#DB9D0D',
            '#60C42D',
            '#FF80CA',
            '#2491B3',
            '#17C76F',
        ],
    };
    constructor(context, options) {
        super(context, Object.assign({}, AssignColorByBranch.defaultOptions, options));
    }
    beforeDraw(input) {
        const nodes = this.context.model.getNodeData();
        if (nodes.length === 0)
            return input;
        let colorIndex = 0;
        const dfs = (nodeId, color) => {
            const node = nodes.find((datum) => datum.id == nodeId);
            if (!node)
                return;
            node.style ||= {};
            node.style.color = color || this.options.colors[colorIndex++ % this.options.colors.length];
            node.children?.forEach((childId) => dfs(childId, node.style?.color));
        };
        nodes.filter((node) => node.depth === 1).forEach((rootNode) => dfs(rootNode.id));
        return input;
    }
}
exports.AssignColorByBranch = AssignColorByBranch;
