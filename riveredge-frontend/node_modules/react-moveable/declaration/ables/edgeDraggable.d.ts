import { DraggableProps, MoveableGroupInterface, MoveableManagerInterface, Renderer } from "../types";
declare const _default: {
    readonly events: readonly [];
    readonly props: readonly [];
    readonly name: "edgeDraggable";
} & {
    css: string[];
    render(moveable: MoveableManagerInterface<DraggableProps>, React: Renderer): any[];
    dragCondition(moveable: MoveableManagerInterface<DraggableProps>, e: any): boolean;
    dragStart(moveable: MoveableManagerInterface<DraggableProps>, e: any): false | import("../types").OnDragStart;
    drag(moveable: MoveableManagerInterface<DraggableProps>, e: any): import("../types").OnDrag | undefined;
    dragEnd(moveable: MoveableManagerInterface<DraggableProps, any>, e: any): import("../types").OnDragEnd | undefined;
    dragGroupCondition(moveable: MoveableGroupInterface<DraggableProps>, e: any): boolean;
    dragGroupStart(moveable: MoveableGroupInterface<DraggableProps>, e: any): false | import("../types").OnDragStart;
    dragGroup(moveable: MoveableGroupInterface<DraggableProps>, e: any): import("../types").OnDragGroup | undefined;
    dragGroupEnd(moveable: MoveableGroupInterface<DraggableProps, any>, e: any): any;
    unset(moveable: any): void;
};
export default _default;
/**
 * Whether to move by dragging the edge line (default: false)
 * @name Moveable.Draggable#edgeDraggable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  draggable: true,
 *  edgeDraggable: false,
 * });
 *
 * moveable.edgeDraggable = true;
 */
