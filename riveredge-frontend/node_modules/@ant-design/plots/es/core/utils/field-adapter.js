import { get } from './index';
export function fieldAdapter(field) {
    switch (typeof field) {
        case 'function':
            return field;
        case 'string':
            return function (d) { return get(d, [field]); };
        default:
            return function () { return field; };
    }
}
