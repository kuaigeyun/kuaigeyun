"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverActivateChain = void 0;
const g6_1 = require("@antv/g6");
/**
 * Behavior to activate the hovered element and its chain (including nodes and edges).
 */
class HoverActivateChain extends g6_1.HoverActivate {
    getActiveIds(event) {
        const { model, graph } = this.context;
        const targetId = event.target.id;
        const targetType = graph.getElementType(targetId);
        const ids = [targetId];
        if (targetType === 'edge') {
            const edge = model.getEdgeDatum(targetId);
            this.collectChainNodes(edge.source, 'in', ids);
            this.collectChainNodes(edge.target, 'out', ids);
        }
        else if (targetType === 'node') {
            this.collectChainNodes(targetId, 'both', ids);
        }
        graph.frontElement(ids);
        return ids;
    }
    collectChainNodes(nodeId, direction, ids) {
        const { model } = this.context;
        const edges = model.getRelatedEdgesData(nodeId, direction);
        edges.forEach((edge) => {
            if (!ids.includes((0, g6_1.idOf)(edge)))
                ids.push((0, g6_1.idOf)(edge));
            if (!ids.includes(edge.source)) {
                ids.push(edge.source);
                this.collectChainNodes(edge.source, 'in', ids);
            }
            if (!ids.includes(edge.target)) {
                ids.push(edge.target);
                this.collectChainNodes(edge.target, 'out', ids);
            }
        });
    }
}
exports.HoverActivateChain = HoverActivateChain;
