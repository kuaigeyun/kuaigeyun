"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapseExpandReactNode = void 0;
const g6_1 = require("@antv/g6");
const lodash_1 = require("lodash");
const react_1 = __importDefault(require("react"));
const base_1 = require("../base");
const hoc_1 = require("../hoc");
const data_1 = require("../utils/data");
const { PlusMinusIcon } = base_1.CollapseExpandIcon;
class CollapseExpandReactNode extends g6_1.BaseTransform {
    static defaultOptions = {
        enable: true,
        trigger: 'icon',
        direction: 'out',
        iconRender: (isCollapsed) => react_1.default.createElement(PlusMinusIcon, { isCollapsed: isCollapsed }),
        iconPlacement: 'bottom',
        iconOffsetX: 0,
        iconOffsetY: 0,
        iconClassName: '',
        iconStyle: {},
        refreshLayout: false,
    };
    constructor(context, options) {
        super(context, Object.assign({}, CollapseExpandReactNode.defaultOptions, options));
    }
    afterLayout() {
        const { graph, element, model } = this.context;
        const { nodes = [], edges = [] } = graph.getData();
        const { enable, ...options } = this.options;
        nodes.forEach((datum) => {
            const nodeId = (0, g6_1.idOf)(datum);
            if (datum.children && datum.children.length > 0)
                return;
            const children = (0, data_1.getNeighborNodeIds)(nodeId, edges, this.options.direction);
            if (children.length === 0)
                return;
            model.updateNodeData([{ id: nodeId, children }]);
        });
        const nodeMapper = graph.getOptions().node;
        if ((0, lodash_1.has)(nodeMapper, 'style.component')) {
            const Component = (0, lodash_1.get)(nodeMapper, 'style.component');
            (0, lodash_1.set)(nodeMapper, 'style.component', (data) => {
                if (!(typeof enable === 'function' ? enable(data) : enable))
                    return Component.call(graph, data);
                const CollapsibleNode = (0, hoc_1.withCollapsibleNode)(Component);
                return react_1.default.createElement(CollapsibleNode, { data: data, graph: graph, ...options });
            });
        }
        graph.setNode(nodeMapper);
        graph.draw();
    }
}
exports.CollapseExpandReactNode = CollapseExpandReactNode;
