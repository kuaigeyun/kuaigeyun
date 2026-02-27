import { IObject } from "@daybrush/utils";
import { RotatableProps, OnRotateGroup, Renderer, OnRotateStart, OnRotate, OnRotateEnd, SnappableProps, SnappableState, MoveableManagerInterface, MoveableGroupInterface, DraggableProps } from "../types";
export declare function getReversePositionX(dir: string): string;
export declare function getReversePositionY(dir: string): string;
export declare function getRotationPositions(rotationPosition: RotatableProps["rotationPosition"], [pos1, pos2, pos3, pos4]: number[][], direction: number): [number[], number][];
export declare function dragControlCondition(moveable: MoveableManagerInterface<RotatableProps>, e: any): boolean;
declare const _default: {
    name: string;
    canPinch: boolean;
    props: readonly ["rotatable", "rotationPosition", "throttleRotate", "renderDirections", "rotationTarget", "rotateAroundControls", "edge", "resolveAblesWithRotatable", "displayAroundControls"];
    events: readonly ["rotateStart", "beforeRotate", "rotate", "rotateEnd", "rotateGroupStart", "beforeRotateGroup", "rotateGroup", "rotateGroupEnd"];
    css: string[];
    viewClassName(moveable: MoveableManagerInterface<RotatableProps>): string;
    render(moveable: MoveableManagerInterface<RotatableProps>, React: Renderer): any;
    dragControlCondition: (moveable: any, e: any) => boolean;
    dragControlStart(moveable: MoveableManagerInterface<RotatableProps & SnappableProps & DraggableProps, SnappableState>, e: any): false | OnRotateStart;
    dragControl(moveable: MoveableManagerInterface<RotatableProps & DraggableProps>, e: any): OnRotate | undefined;
    dragControlEnd(moveable: MoveableManagerInterface<RotatableProps>, e: any): OnRotateEnd | undefined;
    dragGroupControlCondition: (moveable: any, e: any) => boolean;
    dragGroupControlStart(moveable: MoveableGroupInterface<any, any>, e: any): false | OnRotateStart;
    dragGroupControl(moveable: MoveableGroupInterface<any, any>, e: any): OnRotateGroup | undefined;
    dragGroupControlEnd(moveable: MoveableGroupInterface<any, any>, e: any): any;
    /**
     * @method Moveable.Rotatable#request
     * @param {object} [e] - the Resizable's request parameter
     * @param {number} [e.deltaRotate=0] -  delta number of rotation
     * @param {number} [e.rotate=0] - absolute number of moveable's rotation
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("rotatable", { deltaRotate: 10 }, true);
     *
     * * moveable.request("rotatable", { rotate: 10 }, true);
     *
     * // requestStart
     * const requester = moveable.request("rotatable");
     *
     * // request
     * requester.request({ deltaRotate: 10 });
     * requester.request({ deltaRotate: 10 });
     * requester.request({ deltaRotate: 10 });
     *
     * requester.request({ rotate: 10 });
     * requester.request({ rotate: 20 });
     * requester.request({ rotate: 30 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(moveable: MoveableManagerInterface<RotatableProps>): {
        isControl: boolean;
        requestStart(): {
            datas: {};
        };
        request(e: IObject<any>): {
            datas: {};
            parentDist: number;
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
        };
    };
};
export default _default;
/**
 * Whether or not target can be rotated. (default: false)
 * @name Moveable.Rotatable#rotatable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.rotatable = true;
 */
/**
 * You can specify the position of the rotation. (default: "top")
 * @name Moveable.Rotatable#rotationPosition
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   rotationPosition: "top",
 * });
 *
 * moveable.rotationPosition = "bottom"
 */
/**
 * throttle of angle(degree) when rotate.
 * @name Moveable.Rotatable#throttleRotate
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleRotate = 1;
 */
/**
 * When the rotate starts, the rotateStart event is called.
 * @memberof Moveable.Rotatable
 * @event rotateStart
 * @param {Moveable.Rotatable.OnRotateStart} - Parameters for the rotateStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { rotatable: true });
 * moveable.on("rotateStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
* When rotating, the rotate event is called.
* @memberof Moveable.Rotatable
* @event rotate
* @param {Moveable.Rotatable.OnRotate} - Parameters for the rotate event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, { rotatable: true });
* moveable.on("rotate", ({ target, transform, dist }) => {
*     target.style.transform = transform;
* });
*/
/**
 * When the rotate finishes, the rotateEnd event is called.
 * @memberof Moveable.Rotatable
 * @event rotateEnd
 * @param {Moveable.Rotatable.OnRotateEnd} - Parameters for the rotateEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { rotatable: true });
 * moveable.on("rotateEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
/**
 * When the group rotate starts, the `rotateGroupStart` event is called.
 * @memberof Moveable.Rotatable
 * @event rotateGroupStart
 * @param {Moveable.Rotatable.OnRotateGroupStart} - Parameters for the `rotateGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     rotatable: true
 * });
 * moveable.on("rotateGroupStart", ({ targets }) => {
 *     console.log("onRotateGroupStart", targets);
 * });
 */
/**
* When the group rotate, the `rotateGroup` event is called.
* @memberof Moveable.Rotatable
* @event rotateGroup
* @param {Moveable.Rotatable.OnRotateGroup} - Parameters for the `rotateGroup` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     rotatable: true
* });
* moveable.on("rotateGroup", ({ targets, events }) => {
*     console.log("onRotateGroup", targets);
*     events.forEach(ev => {
*         const target = ev.target;
*         // ev.drag is a drag event that occurs when the group rotate.
*         const left = ev.drag.beforeDist[0];
*         const top = ev.drag.beforeDist[1];
*         const deg = ev.beforeDist;
*     });
* });
*/
/**
 * When the group rotate finishes, the `rotateGroupEnd` event is called.
 * @memberof Moveable.Rotatable
 * @event rotateGroupEnd
 * @param {Moveable.Rotatable.OnRotateGroupEnd} - Parameters for the `rotateGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     rotatable: true
 * });
 * moveable.on("rotateGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onRotateGroupEnd", targets, isDrag);
 * });
 */
