import { ResizableProps, OnResizeGroup, DraggableProps, OnResizeStart, SnappableState, OnResize, OnResizeEnd, MoveableManagerInterface, MoveableGroupInterface, SnappableProps, ResizableRequestParam } from "../types";
declare const _default: {
    name: string;
    ableGroup: string;
    canPinch: boolean;
    props: readonly ["resizable", "throttleResize", "renderDirections", "displayAroundControls", "keepRatio", "resizeFormat", "keepRatioFinally", "edge", "checkResizableError"];
    events: readonly ["resizeStart", "beforeResize", "resize", "resizeEnd", "resizeGroupStart", "beforeResizeGroup", "resizeGroup", "resizeGroupEnd"];
    render: (moveable: MoveableManagerInterface<Partial<import("../types").RenderDirections>, {}>, React: import("../types").Renderer) => any[];
    dragControlCondition: (moveable: any, e: any) => any;
    viewClassName: (moveable: MoveableManagerInterface<{}, {}>) => string;
    dragControlStart(moveable: MoveableManagerInterface<ResizableProps & DraggableProps, SnappableState>, e: any): false | OnResizeStart;
    dragControl(moveable: MoveableManagerInterface<ResizableProps & DraggableProps & SnappableProps>, e: any): OnResize | undefined;
    dragControlAfter(moveable: MoveableManagerInterface<ResizableProps & DraggableProps>, e: any): OnResize | undefined;
    dragControlEnd(moveable: MoveableManagerInterface<ResizableProps & DraggableProps>, e: any): OnResizeEnd | undefined;
    dragGroupControlCondition: (moveable: any, e: any) => any;
    dragGroupControlStart(moveable: MoveableGroupInterface<any, any>, e: any): false | OnResizeStart;
    dragGroupControl(moveable: MoveableGroupInterface<any, any>, e: any): OnResizeGroup | undefined;
    dragGroupControlEnd(moveable: MoveableGroupInterface<any, any>, e: any): any;
    /**
     * @method Moveable.Resizable#request
     * @param {Moveable.Resizable.ResizableRequestParam} e - the Resizable's request parameter
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * // Use Relative Value
     * moveable.request("resizable", { deltaWidth: 10, deltaHeight: 10 }, true);
     *
     * // Use Absolute Value
     * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100 }, true);
     *
     * // requestStart
     * const requester = moveable.request("resizable");
     *
     * // request
     * // Use Relative Value
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     *
     * // Use Absolute Value
     * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100 });
     * moveable.request("resizable", { offsetWidth: 110, offsetHeight: 100 });
     * moveable.request("resizable", { offsetWidth: 120, offsetHeight: 100 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(moveable: MoveableManagerInterface<any>): {
        isControl: boolean;
        requestStart(e: ResizableRequestParam): {
            datas: Record<string, any>;
            parentDirection: number[];
            parentIsWidth: boolean;
            useSnap: boolean;
        };
        request(e: ResizableRequestParam): {
            datas: Record<string, any>;
            parentDist: number[];
            parentKeepRatio: boolean | undefined;
            useSnap: boolean;
        };
        requestEnd(): {
            datas: Record<string, any>;
            isDrag: boolean;
            useSnap: boolean;
        };
    };
    unset(moveable: MoveableManagerInterface<any, {}>): void;
};
export default _default;
/**
 * Whether or not target can be resized.
 * @name Moveable.Resizable#resizable
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     resizable: false,
 * });
 *
 * moveable.resizable = true;
 */
/**
 * throttle of width, height when resize. If throttleResize is set to less than 1, the target may shake.
 * @name Moveable.Resizable#throttleResize
 * @default 1
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 *   throttleResize: 1,
 * });
 *
 * moveable.throttleResize = 0;
 */
/**
 * When resize or scale, keeps a ratio of the width, height.
 * @name Moveable.Resizable#keepRatio
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 * });
 *
 * moveable.keepRatio = true;
 */
/**
 * Set directions to show the control box.
 * @name Moveable.Resizable#renderDirections
 * @default ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 *   renderDirections: ["n", "nw", "ne", "s", "se", "sw", "e", "w"],
 * });
 *
 * moveable.renderDirections = ["nw", "ne", "sw", "se"];
 */
/**
 * Function to convert size for resize
 * @name Moveable.Resizable#resizeFormat
 * @default oneself
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 *   resizeFormat: v => v,
 * });
 *
 * moveable.resizeFormat = (size: number[]) => ([Math.trunc(size[0]), Math.trunc(size[1])];
 */
/**
 * When the resize starts, the resizeStart event is called.
 * @memberof Moveable.Resizable
 * @event resizeStart
 * @param {Moveable.Resizable.OnResizeStart} - Parameters for the resizeStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resizeStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When resizing, `beforeResize` is called before `resize` occurs. In `beforeResize`, you can get and set the pre-value before resizing.
 * @memberof Moveable.Resizable
 * @event beforeResize
 * @param {Moveable.Resizable.OnBeforeResize} - Parameters for the `beforeResize` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("beforeResize", ({ setFixedDirection }) => {
 *     if (shiftKey) {
 *        setFixedDirection([0, 0]);
 *     }
 * });
 * moveable.on("resize", ({ target, width, height, drag }) => {
 *     target.style.width = `${width}px`;
 *     target.style.height = `${height}px`;
 *     target.style.transform = drag.transform;
 * });
 */
/**
 * When resizing, the resize event is called.
 * @memberof Moveable.Resizable
 * @event resize
 * @param {Moveable.Resizable.OnResize} - Parameters for the resize event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resize", ({ target, width, height }) => {
 *     target.style.width = `${e.width}px`;
 *     target.style.height = `${e.height}px`;
 * });
 */
/**
 * When the resize finishes, the resizeEnd event is called.
 * @memberof Moveable.Resizable
 * @event resizeEnd
 * @param {Moveable.Resizable.OnResizeEnd} - Parameters for the resizeEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resizeEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
/**
* When the group resize starts, the `resizeGroupStart` event is called.
* @memberof Moveable.Resizable
* @event resizeGroupStart
* @param {Moveable.Resizable.OnResizeGroupStart} - Parameters for the `resizeGroupStart` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     resizable: true
* });
* moveable.on("resizeGroupStart", ({ targets }) => {
*     console.log("onResizeGroupStart", targets);
* });
*/
/**
* When the group resize, the `resizeGroup` event is called.
* @memberof Moveable.Resizable
* @event resizeGroup
* @param {Moveable.Resizable.onResizeGroup} - Parameters for the `resizeGroup` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     resizable: true
* });
* moveable.on("resizeGroup", ({ targets, events }) => {
*     console.log("onResizeGroup", targets);
*     events.forEach(ev => {
*         const offset = [
*             direction[0] < 0 ? -ev.delta[0] : 0,
*             direction[1] < 0 ? -ev.delta[1] : 0,
*         ];
*         // ev.drag is a drag event that occurs when the group resize.
*         const left = offset[0] + ev.drag.beforeDist[0];
*         const top = offset[1] + ev.drag.beforeDist[1];
*         const width = ev.width;
*         const top = ev.top;
*     });
* });
*/
/**
 * When the group resize finishes, the `resizeGroupEnd` event is called.
 * @memberof Moveable.Resizable
 * @event resizeGroupEnd
 * @param {Moveable.Resizable.OnResizeGroupEnd} - Parameters for the `resizeGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     resizable: true
 * });
 * moveable.on("resizeGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onResizeGroupEnd", targets, isDrag);
 * });
 */
