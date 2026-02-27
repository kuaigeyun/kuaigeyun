"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateReactNodeOrigin = void 0;
const g6_1 = require("@antv/g6");
/**
 * HTML 元素的默认原点位置在左上角，而 G6 的默认原点位置在中心，所以需要调整 dx 和 dy
 */
class TranslateReactNodeOrigin extends g6_1.BaseTransform {
    beforeDraw(input) {
        const { graph, element } = this.context;
        const { add: { nodes: nodesToAdd }, update: { nodes: nodesToUpdate }, } = input;
        [...nodesToAdd.values(), ...nodesToUpdate.values()].forEach((datum) => {
            // @ts-expect-error private method invoke
            element.computeElementDefaultStyle('node', { graph, datum });
            const style = element.getDefaultStyle(datum.id);
            const [width, height] = (0, g6_1.parseSize)(style.size);
            if (!datum.style)
                datum.style = {};
            datum.style.dx = -width / 2;
            datum.style.dy = -height / 2;
        });
        return input;
    }
}
exports.TranslateReactNodeOrigin = TranslateReactNodeOrigin;
