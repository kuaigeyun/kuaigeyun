/*
egjs-children-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import ListDiffer, { ListFormat } from "@egjs/list-differ";
import { findKeyCallback } from "./consts";

/**
 * A module that checks diff when child are added, removed, or changed .
 * @ko 자식 노드들에서 자식 노드가 추가되거나 삭제되거나 순서가 변경된 사항을 체크하는 모듈입니다.
 * @memberof eg
 * @extends eg.ListDiffer
 */
class ChildrenDiffer<T extends Element = Element> extends ListDiffer<T> {
  /**
   * @param - Initializing Children <ko> 초기 설정할 자식 노드들</ko>
   */
  constructor(
    list: ListFormat<T> = [],
  ) {
    super(list, findKeyCallback);
  }
}
export default ChildrenDiffer;
