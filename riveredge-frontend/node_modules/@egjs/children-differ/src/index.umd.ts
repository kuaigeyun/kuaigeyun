/*
egjs-children-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import ChildrenDiffer, { diff } from "./index";

(ChildrenDiffer as any).diff = diff;
export default ChildrenDiffer;
