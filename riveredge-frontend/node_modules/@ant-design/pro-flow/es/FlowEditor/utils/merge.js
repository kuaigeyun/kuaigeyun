import { mergeWith } from 'lodash-es';

/**
 * 用于合并对象，如果是数组则直接替换
 * @param target
 * @param source
 */
export var merge = function merge(target, source) {
  return mergeWith({}, target, source, function (obj, src) {
    if (Array.isArray(obj)) return src;
  });
};