import { BaseTransform, idOf } from '@antv/g6';
import { get, has, set } from 'lodash';
import React from 'react';
import { CollapseExpandIcon } from '../base';
import { withCollapsibleNode } from '../hoc';
import { getNeighborNodeIds } from '../utils/data';
const { PlusMinusIcon } = CollapseExpandIcon;
export class CollapseExpandReactNode extends BaseTransform {
    static defaultOptions = {
        enable: true,
        trigger: 'icon',
        direction: 'out',
        iconRender: (isCollapsed) => React.createElement(PlusMinusIcon, { isCollapsed: isCollapsed }),
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
            const nodeId = idOf(datum);
            if (datum.children && datum.children.length > 0)
                return;
            const children = getNeighborNodeIds(nodeId, edges, this.options.direction);
            if (children.length === 0)
                return;
            model.updateNodeData([{ id: nodeId, children }]);
        });
        const nodeMapper = graph.getOptions().node;
        if (has(nodeMapper, 'style.component')) {
            const Component = get(nodeMapper, 'style.component');
            set(nodeMapper, 'style.component', (data) => {
                if (!(typeof enable === 'function' ? enable(data) : enable))
                    return Component.call(graph, data);
                const CollapsibleNode = withCollapsibleNode(Component);
                return React.createElement(CollapsibleNode, { data: data, graph: graph, ...options });
            });
        }
        graph.setNode(nodeMapper);
        graph.draw();
    }
}
