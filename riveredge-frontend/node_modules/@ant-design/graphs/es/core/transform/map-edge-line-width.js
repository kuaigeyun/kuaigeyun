import { BaseTransform, idOf } from '@antv/g6';
import { linear, log, pow, sqrt } from '../utils/scale';
export class MapEdgeLineWidth extends BaseTransform {
    static defaultOptions = {
        minValue: (edge, edges) => Math.min(...Object.values(edges)),
        maxValue: (edge, edges) => Math.max(...Object.values(edges)),
        minLineWidth: 1,
        maxLineWidth: 10,
        scale: 'linear',
    };
    constructor(context, options) {
        super(context, Object.assign({}, MapEdgeLineWidth.defaultOptions, options));
    }
    beforeDraw(input) {
        const { maxValue, minValue, maxLineWidth, minLineWidth, scale, value } = this.options;
        const edges = this.context.model.getEdgeData();
        const valueFunc = typeof value === 'function' ? value : () => value;
        const values = Object.fromEntries(edges.map((edge) => [idOf(edge), valueFunc(edge)]));
        const { add: { edges: edgesToAdd }, update: { edges: edgesToUpdate }, } = input;
        [...edgesToAdd.values(), ...edgesToUpdate.values()].forEach((edge) => {
            const lineWidth = this.assignLineWidthByValue(values[idOf(edge)] || 0, typeof minValue === 'function' ? minValue(edge, values) : minValue, typeof maxValue === 'function' ? maxValue(edge, values) : maxValue, typeof minLineWidth === 'function' ? minLineWidth(edge) : minLineWidth, typeof maxLineWidth === 'function' ? maxLineWidth(edge) : maxLineWidth, scale);
            edge.style ||= {};
            edge.style.lineWidth = lineWidth;
        });
        return input;
    }
    assignLineWidthByValue = (value, minValue, maxValue, minLineWidth, maxLineWidth, scale) => {
        const domain = [minValue, maxValue];
        const range = [minLineWidth, maxLineWidth];
        if (value < minValue || value > maxValue || minValue === maxValue)
            return range[0];
        if (typeof scale === 'function')
            return scale(value, domain, range);
        switch (scale) {
            case 'linear':
                return linear(value, domain, range);
            case 'log':
                return log(value, domain, range);
            case 'pow':
                return pow(value, domain, range, 2);
            case 'sqrt':
                return sqrt(value, domain, range);
            default:
                return range[0];
        }
    };
}
