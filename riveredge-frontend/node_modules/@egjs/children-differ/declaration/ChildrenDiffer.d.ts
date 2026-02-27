import ListDiffer, { ListFormat } from "@egjs/list-differ";
declare class ChildrenDiffer<T extends Element = Element> extends ListDiffer<T> {
    constructor(list?: ListFormat<T>);
}
export default ChildrenDiffer;
