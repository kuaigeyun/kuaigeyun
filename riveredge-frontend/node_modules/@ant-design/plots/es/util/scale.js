var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { get, isArray, isString, set } from '.';
export default function scale(props) {
    var yField = props.yField, data = props.data;
    var noDomainMax = isArray(data) && data.length > 0 && isString(yField) && !get(props, 'scale.y.domainMax');
    var newProps = Object.isFrozen(props) ? __assign({}, props) : props;
    if (noDomainMax && data.reduce(function (acc, item) { return acc + item[yField]; }, 0) === 0) {
        set(newProps, 'scale.y.domainMax', 1);
    }
    else if (noDomainMax && data.reduce(function (acc, item) { return acc + item[yField]; }, 0) !== 0) {
        set(newProps, 'scale.y.domainMax', undefined);
    }
    return newProps;
}
