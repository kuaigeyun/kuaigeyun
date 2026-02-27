import { register } from '@antv/g2';
export var reisterShape = function () {
    /**
     * Draw 2.5d bar shape.
     */
    var draw25DBar = function (style, context) {
        return function (points) {
            var _a = style.fill, fill = _a === void 0 ? '#2888FF' : _a, stroke = style.stroke, _b = style.fillOpacity, fillOpacity = _b === void 0 ? 1 : _b, _c = style.strokeOpacity, strokeOpacity = _c === void 0 ? 0.2 : _c, _d = style.pitch, pitch = _d === void 0 ? 8 : _d;
            var p1 = points[0], p2 = points[1], p3 = points[2], p4 = points[3];
            var height = (p2[1] - p1[1]) / 2;
            var document = context.document;
            var g = document.createElement('g', {});
            var top = document.createElement('polygon', {
                style: {
                    points: [p1, [p1[0] - pitch, p1[1] + height], [p3[0] - pitch, p1[1] + height], p4],
                    fill: fill,
                    fillOpacity: fillOpacity,
                    stroke: stroke,
                    strokeOpacity: strokeOpacity,
                    inset: 30,
                },
            });
            var bottom = document.createElement('polygon', {
                style: {
                    points: [[p1[0] - pitch, p1[1] + height], p2, p3, [p3[0] - pitch, p1[1] + height]],
                    fill: fill,
                    fillOpacity: fillOpacity,
                    stroke: stroke,
                    strokeOpacity: strokeOpacity,
                },
            });
            var right = document.createElement('polygon', {
                style: {
                    points: [p1, [p1[0] - pitch, p1[1] + height], p2, [p1[0] + pitch, p1[1] + height]],
                    fill: fill,
                    fillOpacity: fillOpacity - 0.2,
                },
            });
            g.appendChild(top);
            g.appendChild(bottom);
            g.appendChild(right);
            return g;
        };
    };
    // @ts-ignore
    register('shape.interval.bar25D', draw25DBar);
};
