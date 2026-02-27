import { get } from 'lodash';
export function formatLabel(datum, labelField) {
    const label = labelField
        ? typeof labelField === 'function'
            ? labelField(datum)
            : get(datum, `data.${labelField}`, datum.id)
        : datum.id;
    return String(label);
}
