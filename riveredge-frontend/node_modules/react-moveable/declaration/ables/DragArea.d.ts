import { Renderer, GroupableProps, DragAreaProps, MoveableManagerInterface, MoveableGroupInterface } from "../types";
declare const _default: {
    name: string;
    props: readonly ["dragArea", "passDragArea"];
    events: readonly ["click", "clickGroup"];
    render(moveable: MoveableManagerInterface<GroupableProps>, React: Renderer): any[];
    dragStart(moveable: MoveableManagerInterface, { datas, clientX, clientY, inputEvent }: any): false | undefined;
    drag(moveable: MoveableManagerInterface, { datas, inputEvent }: any): false | undefined;
    dragEnd(moveable: MoveableManagerInterface<DragAreaProps>, e: any): false | undefined;
    dragGroupStart(moveable: MoveableGroupInterface, e: any): false | undefined;
    dragGroup(moveable: MoveableGroupInterface, e: any): false | undefined;
    dragGroupEnd(moveable: MoveableGroupInterface<DragAreaProps>, e: any): false | undefined;
    unset(moveable: MoveableManagerInterface<DragAreaProps>): void;
    enableNativeEvent(moveable: MoveableManagerInterface<DragAreaProps>): void;
};
export default _default;
/**
 * Add an event to the moveable area instead of the target for stopPropagation. (default: false, true in group)
 * @name Moveable#dragArea
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  dragArea: false,
 * });
 */
/**
 * Set `pointerEvents: none;` css to pass events in dragArea. (default: false)
 * @name Moveable#passDragArea
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  dragArea: false,
 * });
 */
