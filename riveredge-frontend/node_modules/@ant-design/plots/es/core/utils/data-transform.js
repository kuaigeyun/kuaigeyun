import { get, isPlainObject, set } from '../utils';
/**
 * Data transformation.
 * @description `data` to `data.value`
 * If `data` is not an object or does not have a `value` property, it will be set to `data.value`.
 * If `data` is an object without a `type` property, it will be set to `data.value`.
 * @param params - The adaptor parameters.
 * @returns The updated parameters with transformed data.
 */
export var dataTransform = function (params) {
    var options = params.options;
    var data = options.data;
    if (get(data, 'value'))
        return params;
    if (get(data, 'type') !== 'fetch' && isPlainObject(data)) {
        set(options, 'data.value', data);
    }
    return params;
};
