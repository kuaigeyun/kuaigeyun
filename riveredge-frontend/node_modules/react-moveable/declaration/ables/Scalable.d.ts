import { ScalableProps, OnScaleGroup, OnScaleGroupStart, DraggableProps, SnappableState, GroupableProps, OnScaleStart, OnScale, OnScaleEnd, MoveableManagerInterface, MoveableGroupInterface } from "../types";
import { IObject } from "@daybrush/utils";
/**
 * @namespace Scalable
 * @memberof Moveable
 * @description Scalable indicates whether the target's x and y can be scale of transform.
 */
declare const _default: {
    name: string;
    ableGroup: string;
    canPinch: boolean;
    props: readonly ["scalable", "throttleScale", "renderDirections", "keepRatio", "edge", "displayAroundControls"];
    events: readonly ["scaleStart", "beforeScale", "scale", "scaleEnd", "scaleGroupStart", "beforeScaleGroup", "scaleGroup", "scaleGroupEnd"];
    render: (moveable: MoveableManagerInterface<Partial<import("../types").RenderDirections>, {}>, React: import("../types").Renderer) => any[];
    dragControlCondition: (moveable: any, e: any) => any;
    viewClassName: (moveable: MoveableManagerInterface<{}, {}>) => string;
    dragControlStart(moveable: MoveableManagerInterface<ScalableProps & DraggableProps, SnappableState>, e: any): false | OnScaleStart;
    dragControl(moveable: MoveableManagerInterface<ScalableProps & DraggableProps & GroupableProps, SnappableState>, e: any): false | OnScale;
    dragControlEnd(moveable: MoveableManagerInterface<ScalableProps>, e: any): false | OnScaleEnd;
    dragGroupControlCondition: (moveable: any, e: any) => any;
    dragGroupControlStart(moveable: MoveableGroupInterface<any, any>, e: any): false | OnScaleGroupStart;
    dragGroupControl(moveable: MoveableGroupInterface<any, any>, e: any): OnScaleGroup | undefined;
    dragGroupControlEnd(moveable: MoveableGroupInterface<any, any>, e: any): any;
    /**
     * @method Moveable.Scalable#request
     * @param {Moveable.Scalable.ScalableRequestParam} e - the Scalable's request parameter
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("scalable", { deltaWidth: 10, deltaHeight: 10 }, true);
     *
     * // requestStart
     * const requester = moveable.request("scalable");
     *
     * // request
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(): {
        isControl: boolean;
        requestStart(e: IObject<any>): {
            datas: {};
            parentDirection: any;
            useSnap: boolean;
        };
        request(e: IObject<any>): {
            datas: {};
            parentDist: number[];
            parentKeepRatio: any;
            useSnap: boolean;
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
            useSnap: boolean;
        };
    };
};
export default _default;
/**
 * Whether or not target can scaled.
 *
 * @name Moveable.Scalable#scalable
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.scalable = true;
 */
/**
 * throttle of scaleX, scaleY when scale.
 * @name Moveable.Scalable#throttleScale
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleScale = 0.1;
 */
/**
 * Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 * @name Moveable.Scalable#renderDirections
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     scalable: true,
 *   renderDirections: ["n", "nw", "ne", "s", "se", "sw", "e", "w"],
 * });
 *
 * moveable.renderDirections = ["nw", "ne", "sw", "se"];
 */
/**
 * When resize or scale, keeps a ratio of the width, height. (default: false)
 * @name Moveable.Scalable#keepRatio
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     scalable: true,
 * });
 *
 * moveable.keepRatio = true;
 */
/**
 * When the scale starts, the scaleStart event is called.
 * @memberof Moveable.Scalable
 * @event scaleStart
 * @param {Moveable.Scalable.OnScaleStart} - Parameters for the scaleStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scaleStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When scaling, `beforeScale` is called before `scale` occurs. In `beforeScale`, you can get and set the pre-value before scaling.
 * @memberof Moveable.Scalable
 * @event beforeScale
 * @param {Moveable.Scalable.OnBeforeScale} - Parameters for the `beforeScale` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("beforeScale", ({ setFixedDirection }) => {
 *     if (shiftKey) {
 *        setFixedDirection([0, 0]);
 *     }
 * });
 * moveable.on("scale", ({ target, transform, dist }) => {
 *     target.style.transform = transform;
 * });
 */
/**
 * When scaling, the `scale` event is called.
 * @memberof Moveable.Scalable
 * @event scale
 * @param {Moveable.Scalable.OnScale} - Parameters for the `scale` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scale", ({ target, transform, dist }) => {
 *     target.style.transform = transform;
 * });
 */
/**
 * When the scale finishes, the `scaleEnd` event is called.
 * @memberof Moveable.Scalable
 * @event scaleEnd
 * @param {Moveable.Scalable.OnScaleEnd} - Parameters for the `scaleEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scaleEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
/**
* When the group scale starts, the `scaleGroupStart` event is called.
* @memberof Moveable.Scalable
* @event scaleGroupStart
* @param {Moveable.Scalable.OnScaleGroupStart} - Parameters for the `scaleGroupStart` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     scalable: true
* });
* moveable.on("scaleGroupStart", ({ targets }) => {
*     console.log("onScaleGroupStart", targets);
* });
*/
/**
* When the group scale, the `scaleGroup` event is called.
* @memberof Moveable.Scalable
* @event scaleGroup
* @param {Moveable.Scalable.OnScaleGroup} - Parameters for the `scaleGroup` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     scalable: true
* });
* moveable.on("scaleGroup", ({ targets, events }) => {
*     console.log("onScaleGroup", targets);
*     events.forEach(ev => {
*         const target = ev.target;
*         // ev.drag is a drag event that occurs when the group scale.
*         const left = ev.drag.beforeDist[0];
*         const top = ev.drag.beforeDist[1];
*         const scaleX = ev.scale[0];
*         const scaleY = ev.scale[1];
*     });
* });
*/
/**
 * When the group scale finishes, the `scaleGroupEnd` event is called.
 * @memberof Moveable.Scalable
 * @event scaleGroupEnd
 * @param {Moveable.Scalable.OnScaleGroupEnd} - Parameters for the `scaleGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     scalable: true
 * });
 * moveable.on("scaleGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onScaleGroupEnd", targets, isDrag);
 * });
 */
