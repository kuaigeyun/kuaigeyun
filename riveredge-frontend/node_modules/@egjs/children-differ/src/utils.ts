/*
egjs-children-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import {diff as listdiff} from "@egjs/list-differ";
import { findKeyCallback } from "./consts";
import { ChildrenDiffResult } from "./types";


/**
 *
 * @memberof eg.ChildrenDiffer
 * @static
 * @function
 * @param - Previous List <ko> 이전 목록 </ko>
 * @param - List to Update <ko> 업데이트 할 목록 </ko>
 * @return - Returns the diff between `prevList` and `list` <ko> `prevList`와 `list`의 다른 점을 반환한다.</ko>
 * @example
 * import { diff } from "@egjs/children-differ";
 * // script => eg.ChildrenDiffer.diff
 * const result = diff([0, 1, 2, 3, 4, 5], [7, 8, 0, 4, 3, 6, 2, 1]);
 * // List before update
 * // [1, 2, 3, 4, 5]
 * console.log(result.prevList);
 * // Updated list
 * // [4, 3, 6, 2, 1]
 * console.log(result.list);
 * // Index array of values added to `list`
 * // [0, 1, 5]
 * console.log(result.added);
 * // Index array of values removed in `prevList`
 * // [5]
 * console.log(result.removed);
 * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
 * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
 * console.log(result.changed);
 * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
 * // [[4, 3], [3, 4], [2, 6]]
 * console.log(result.pureChanged);
 * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
 * // [[4, 1], [4, 2], [4, 3]]
 * console.log(result.ordered);
 * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved
 * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
 * console.log(result.maintained);
 */
export function diff<T extends Element = Element>(
  prevList: T[],
  list: T[],
): ChildrenDiffResult<T> {
  return listdiff<T>(prevList, list, findKeyCallback);
}
