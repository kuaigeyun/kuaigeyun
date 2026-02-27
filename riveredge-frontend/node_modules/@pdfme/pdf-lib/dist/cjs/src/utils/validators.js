"use strict";
/* tslint:disable:ban-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPositive = exports.assertInteger = exports.assertMultiple = exports.assertRangeOrUndefined = exports.assertRange = exports.assertEachIs = exports.assertOrUndefined = exports.assertIs = exports.createTypeErrorMsg = exports.isType = exports.getType = exports.assertIsSubset = exports.assertIsOneOfOrUndefined = exports.assertIsOneOf = exports.createValueErrorMsg = exports.singleQuote = exports.backtick = void 0;
const objects_1 = require("./objects");
const backtick = (val) => `\`${val}\``;
exports.backtick = backtick;
const singleQuote = (val) => `'${val}'`;
exports.singleQuote = singleQuote;
// prettier-ignore
const formatValue = (value) => {
    const type = typeof value;
    if (type === 'string')
        return (0, exports.singleQuote)(value);
    else if (type === 'undefined')
        return (0, exports.backtick)(value);
    else
        return value;
};
const createValueErrorMsg = (value, valueName, values) => {
    const allowedValues = new Array(values.length);
    for (let idx = 0, len = values.length; idx < len; idx++) {
        const v = values[idx];
        allowedValues[idx] = formatValue(v);
    }
    const joinedValues = allowedValues.join(' or ');
    // prettier-ignore
    return `${(0, exports.backtick)(valueName)} must be one of ${joinedValues}, but was actually ${formatValue(value)}`;
};
exports.createValueErrorMsg = createValueErrorMsg;
const assertIsOneOf = (value, valueName, allowedValues) => {
    if (!Array.isArray(allowedValues)) {
        allowedValues = (0, objects_1.values)(allowedValues);
    }
    for (let idx = 0, len = allowedValues.length; idx < len; idx++) {
        if (value === allowedValues[idx])
            return;
    }
    throw new TypeError((0, exports.createValueErrorMsg)(value, valueName, allowedValues));
};
exports.assertIsOneOf = assertIsOneOf;
const assertIsOneOfOrUndefined = (value, valueName, allowedValues) => {
    if (!Array.isArray(allowedValues)) {
        allowedValues = (0, objects_1.values)(allowedValues);
    }
    (0, exports.assertIsOneOf)(value, valueName, allowedValues.concat(undefined));
};
exports.assertIsOneOfOrUndefined = assertIsOneOfOrUndefined;
const assertIsSubset = (values, valueName, allowedValues) => {
    if (!Array.isArray(allowedValues)) {
        allowedValues = (0, objects_1.values)(allowedValues);
    }
    for (let idx = 0, len = values.length; idx < len; idx++) {
        (0, exports.assertIsOneOf)(values[idx], valueName, allowedValues);
    }
};
exports.assertIsSubset = assertIsSubset;
const getType = (val) => {
    if (val === null)
        return 'null';
    if (val === undefined)
        return 'undefined';
    if (typeof val === 'string')
        return 'string';
    if (isNaN(val))
        return 'NaN';
    if (typeof val === 'number')
        return 'number';
    if (typeof val === 'boolean')
        return 'boolean';
    if (typeof val === 'symbol')
        return 'symbol';
    if (typeof val === 'bigint')
        return 'bigint';
    if (val.constructor && val.constructor.name)
        return val.constructor.name;
    if (val.name)
        return val.name;
    if (val.constructor)
        return String(val.constructor);
    return String(val);
};
exports.getType = getType;
const isType = (value, type) => {
    if (type === 'null')
        return value === null;
    if (type === 'undefined')
        return value === undefined;
    if (type === 'string')
        return typeof value === 'string';
    if (type === 'number')
        return typeof value === 'number' && !isNaN(value);
    if (type === 'boolean')
        return typeof value === 'boolean';
    if (type === 'symbol')
        return typeof value === 'symbol';
    if (type === 'bigint')
        return typeof value === 'bigint';
    if (type === Date)
        return value instanceof Date;
    if (type === Array)
        return value instanceof Array;
    if (type === Uint8Array)
        return value instanceof Uint8Array;
    if (type === ArrayBuffer)
        return value instanceof ArrayBuffer;
    if (type === Function)
        return value instanceof Function;
    return value instanceof type[0];
};
exports.isType = isType;
const createTypeErrorMsg = (value, valueName, types) => {
    const allowedTypes = new Array(types.length);
    for (let idx = 0, len = types.length; idx < len; idx++) {
        const type = types[idx];
        if (type === 'null')
            allowedTypes[idx] = (0, exports.backtick)('null');
        if (type === 'undefined')
            allowedTypes[idx] = (0, exports.backtick)('undefined');
        if (type === 'string')
            allowedTypes[idx] = (0, exports.backtick)('string');
        else if (type === 'number')
            allowedTypes[idx] = (0, exports.backtick)('number');
        else if (type === 'boolean')
            allowedTypes[idx] = (0, exports.backtick)('boolean');
        else if (type === 'symbol')
            allowedTypes[idx] = (0, exports.backtick)('symbol');
        else if (type === 'bigint')
            allowedTypes[idx] = (0, exports.backtick)('bigint');
        else if (type === Array)
            allowedTypes[idx] = (0, exports.backtick)('Array');
        else if (type === Uint8Array)
            allowedTypes[idx] = (0, exports.backtick)('Uint8Array');
        else if (type === ArrayBuffer)
            allowedTypes[idx] = (0, exports.backtick)('ArrayBuffer');
        else
            allowedTypes[idx] = (0, exports.backtick)(type[1]);
    }
    const joinedTypes = allowedTypes.join(' or ');
    // prettier-ignore
    return `${(0, exports.backtick)(valueName)} must be of type ${joinedTypes}, but was actually of type ${(0, exports.backtick)((0, exports.getType)(value))}`;
};
exports.createTypeErrorMsg = createTypeErrorMsg;
const assertIs = (value, valueName, types) => {
    for (let idx = 0, len = types.length; idx < len; idx++) {
        if ((0, exports.isType)(value, types[idx]))
            return;
    }
    throw new TypeError((0, exports.createTypeErrorMsg)(value, valueName, types));
};
exports.assertIs = assertIs;
const assertOrUndefined = (value, valueName, types) => {
    (0, exports.assertIs)(value, valueName, types.concat('undefined'));
};
exports.assertOrUndefined = assertOrUndefined;
const assertEachIs = (values, valueName, types) => {
    for (let idx = 0, len = values.length; idx < len; idx++) {
        (0, exports.assertIs)(values[idx], valueName, types);
    }
};
exports.assertEachIs = assertEachIs;
const assertRange = (value, valueName, min, max) => {
    (0, exports.assertIs)(value, valueName, ['number']);
    (0, exports.assertIs)(min, 'min', ['number']);
    (0, exports.assertIs)(max, 'max', ['number']);
    max = Math.max(min, max);
    if (value < min || value > max) {
        // prettier-ignore
        throw new Error(`${(0, exports.backtick)(valueName)} must be at least ${min} and at most ${max}, but was actually ${value}`);
    }
};
exports.assertRange = assertRange;
const assertRangeOrUndefined = (value, valueName, min, max) => {
    (0, exports.assertIs)(value, valueName, ['number', 'undefined']);
    if (typeof value === 'number')
        (0, exports.assertRange)(value, valueName, min, max);
};
exports.assertRangeOrUndefined = assertRangeOrUndefined;
const assertMultiple = (value, valueName, multiplier) => {
    (0, exports.assertIs)(value, valueName, ['number']);
    if (value % multiplier !== 0) {
        // prettier-ignore
        throw new Error(`${(0, exports.backtick)(valueName)} must be a multiple of ${multiplier}, but was actually ${value}`);
    }
};
exports.assertMultiple = assertMultiple;
const assertInteger = (value, valueName) => {
    if (!Number.isInteger(value)) {
        throw new Error(`${(0, exports.backtick)(valueName)} must be an integer, but was actually ${value}`);
    }
};
exports.assertInteger = assertInteger;
const assertPositive = (value, valueName) => {
    if (![1, 0].includes(Math.sign(value))) {
        // prettier-ignore
        throw new Error(`${(0, exports.backtick)(valueName)} must be a positive number or 0, but was actually ${value}`);
    }
};
exports.assertPositive = assertPositive;
//# sourceMappingURL=validators.js.map