/*
egjs-children-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import {DiffResult} from "@egjs/list-differ";


/**
 * @typedef
 * @memberof eg.ChildrenDiffer
 * @extends eg.ListDiffer.DiffResult
 */
export interface ChildrenDiffResult<T extends Element = Element> extends DiffResult<T> {}
