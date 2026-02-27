"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverActivateNeighbors = void 0;
const g6_1 = require("@antv/g6");
class HoverActivateNeighbors extends g6_1.HoverActivate {
    getActiveIds(event) {
        const { model, graph } = this.context;
        const targetId = event.target.id;
        const targetType = graph.getElementType(targetId);
        const ids = [targetId];
        if (targetType === 'edge') {
            const edge = model.getEdgeDatum(targetId);
            ids.push(edge.source, edge.target);
        }
        else if (targetType === 'node') {
            ids.push(...model.getRelatedEdgesData(targetId).map(g6_1.idOf));
        }
        graph.frontElement(ids);
        return ids;
    }
}
exports.HoverActivateNeighbors = HoverActivateNeighbors;
