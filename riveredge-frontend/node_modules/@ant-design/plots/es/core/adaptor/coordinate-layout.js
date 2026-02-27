/**
 * layout = 'horizontal' | 'vertical'
 * @param params
 * @returns
 */
export function coordinateLayout(params) {
    var _a = params.options.layout, layout = _a === void 0 ? 'horizontal' : _a;
    params.options.coordinate.transform = layout !== 'horizontal' ? undefined : [{ type: 'transpose' }];
    return params;
}
/**
 * layout = 'horizontal' | 'vertical'
 * all children change
 * @param params
 * @returns
 */
export function allCoordinateLayout(params) {
    coordinateLayout(params);
    var _a = params.options.layout, layout = _a === void 0 ? 'horizontal' : _a;
    params.options.children.forEach(function (item) {
        var _a;
        if ((_a = item === null || item === void 0 ? void 0 : item.coordinate) === null || _a === void 0 ? void 0 : _a.transform) {
            item.coordinate.transform = layout !== 'horizontal' ? undefined : [{ type: 'transpose' }];
        }
    });
    return params;
}
