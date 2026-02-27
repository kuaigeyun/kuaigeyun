import { DraggableProps, OnDrag, OnDragGroup, OnDragStart, OnDragEnd, DraggableState, Renderer, MoveableManagerInterface, MoveableGroupInterface } from "../types";
/**
 * @namespace Draggable
 * @memberof Moveable
 * @description Draggable refers to the ability to drag and move targets.
 */
declare const _default: {
    name: string;
    props: readonly ["draggable", "throttleDrag", "throttleDragRotate", "hideThrottleDragRotateLine", "startDragRotate", "edgeDraggable"];
    events: readonly ["dragStart", "drag", "dragEnd", "dragGroupStart", "dragGroup", "dragGroupEnd"];
    requestStyle(): string[];
    requestChildStyle(): string[];
    render(moveable: MoveableManagerInterface<DraggableProps, DraggableState>, React: Renderer): any[];
    dragStart(moveable: MoveableManagerInterface<DraggableProps, any>, e: any): false | OnDragStart;
    drag(moveable: MoveableManagerInterface<DraggableProps, any>, e: any): OnDrag | undefined;
    dragAfter(moveable: MoveableManagerInterface<DraggableProps, DraggableState>, e: any): false | OnDrag | undefined;
    dragEnd(moveable: MoveableManagerInterface<DraggableProps, DraggableState>, e: any): OnDragEnd | undefined;
    dragGroupStart(moveable: MoveableGroupInterface<any, any>, e: any): false | OnDragStart;
    dragGroup(moveable: MoveableGroupInterface<any, any>, e: any): OnDragGroup | undefined;
    dragGroupEnd(moveable: MoveableGroupInterface<any, any>, e: any): any;
    /**
     * @method Moveable.Draggable#request
     * @param {object} [e] - the draggable's request parameter
     * @param {number} [e.x] - x position
     * @param {number} [e.y] - y position
     * @param {number} [e.deltaX] - X number to move
     * @param {number} [e.deltaY] - Y number to move
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * // Use Relative Value
     * moveable.request("draggable", { deltaX: 10, deltaY: 10 }, true);
     * // Use Absolute Value
     * moveable.request("draggable", { x: 200, y: 100 }, true);
     *
     * // requestStart
     * const requester = moveable.request("draggable");
     *
     * // request
     * // Use Relative Value
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * // Use Absolute Value
     * moveable.request("draggable", { x: 200, y: 100 });
     * moveable.request("draggable", { x: 220, y: 100 });
     * moveable.request("draggable", { x: 240, y: 100 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(moveable: MoveableManagerInterface<any, any>): {
        isControl: boolean;
        requestStart(e: Record<string, any>): {
            datas: {};
            useSnap: boolean;
        };
        request(e: Record<string, any>): {
            datas: {};
            distX: number;
            distY: number;
            useSnap: boolean;
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
            useSnap: boolean;
        };
    };
    unset(moveable: MoveableManagerInterface<any, Record<string, any>>): void;
};
export default _default;
/**
 * Whether or not target can be dragged. (default: false)
 * @name Moveable.Draggable#draggable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.draggable = true;
 */
/**
 * throttle of x, y when drag.
 * @name Moveable.Draggable#throttleDrag
 * @default 0
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleDrag = 1;
 */
/**
* throttle of angle of x, y when drag.
* @name Moveable.Draggable#throttleDragRotate
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body);
*
* moveable.throttleDragRotate = 45;
*/
/**
* start angle of throttleDragRotate of x, y when drag.
* @name Moveable.Draggable#startDragRotate
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body);
*
* // 45, 135, 225, 315
* moveable.throttleDragRotate = 90;
* moveable.startDragRotate = 45;
*/
/**
 * When the drag starts, the dragStart event is called.
 * @memberof Moveable.Draggable
 * @event dragStart
 * @param {Moveable.Draggable.OnDragStart} - Parameters for the dragStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("dragStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When dragging, the drag event is called.
 * @memberof Moveable.Draggable
 * @event drag
 * @param {Moveable.Draggable.OnDrag} - Parameters for the drag event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("drag", ({ target, transform }) => {
 *     target.style.transform = transform;
 * });
 */
/**
 * When the drag finishes, the dragEnd event is called.
 * @memberof Moveable.Draggable
 * @event dragEnd
 * @param {Moveable.Draggable.OnDragEnd} - Parameters for the dragEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("dragEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
/**
* When the group drag starts, the `dragGroupStart` event is called.
* @memberof Moveable.Draggable
* @event dragGroupStart
* @param {Moveable.Draggable.OnDragGroupStart} - Parameters for the `dragGroupStart` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     draggable: true
* });
* moveable.on("dragGroupStart", ({ targets }) => {
*     console.log("onDragGroupStart", targets);
* });
*/
/**
* When the group drag, the `dragGroup` event is called.
* @memberof Moveable.Draggable
* @event dragGroup
* @param {Moveable.Draggable.OnDragGroup} - Parameters for the `dragGroup` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     draggable: true
* });
* moveable.on("dragGroup", ({ targets, events }) => {
*     console.log("onDragGroup", targets);
*     events.forEach(ev => {
*          // drag event
*          console.log("onDrag left, top", ev.left, ev.top);
*          // ev.target!.style.left = `${ev.left}px`;
*          // ev.target!.style.top = `${ev.top}px`;
*          console.log("onDrag translate", ev.dist);
*          ev.target!.style.transform = ev.transform;)
*     });
* });
*/
/**
 * When the group drag finishes, the `dragGroupEnd` event is called.
 * @memberof Moveable.Draggable
 * @event dragGroupEnd
 * @param {Moveable.Draggable.OnDragGroupEnd} - Parameters for the `dragGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     draggable: true
 * });
 * moveable.on("dragGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onDragGroupEnd", targets, isDrag);
 * });
 */
