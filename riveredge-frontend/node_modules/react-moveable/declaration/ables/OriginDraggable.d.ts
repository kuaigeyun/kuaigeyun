import { OnDragOriginStart, OnDragOrigin, MoveableManagerInterface, DraggableProps, OriginDraggableProps, MoveableGroupInterface } from "../types";
import { IObject } from "@daybrush/utils";
/**
 * @namespace OriginDraggable
 * @memberof Moveable
 * @description Whether to drag origin (default: false)
 */
declare const _default: {
    name: string;
    props: readonly ["originDraggable", "originRelative"];
    events: readonly ["dragOriginStart", "dragOrigin", "dragOriginEnd"];
    css: string[];
    dragControlCondition(_: any, e: any): boolean;
    dragControlStart(moveable: MoveableManagerInterface<OriginDraggableProps & DraggableProps>, e: any): false | OnDragOriginStart;
    dragControl(moveable: MoveableManagerInterface<OriginDraggableProps & DraggableProps>, e: any): false | OnDragOrigin;
    dragControlEnd(moveable: MoveableManagerInterface<OriginDraggableProps>, e: any): boolean;
    dragGroupControlCondition(moveable: any, e: any): boolean;
    dragGroupControlStart(moveable: MoveableGroupInterface<OriginDraggableProps>, e: any): boolean;
    dragGroupControl(moveable: MoveableGroupInterface<OriginDraggableProps>, e: any): boolean;
    /**
    * @method Moveable.OriginDraggable#request
    * @param {object} e - the OriginDraggable's request parameter
    * @param {number} [e.x] - x position
    * @param {number} [e.y] - y position
    * @param {number} [e.deltaX] - x number to move
    * @param {number} [e.deltaY] - y number to move
    * @param {array} [e.deltaOrigin] - left, top number to move transform-origin
    * @param {array} [e.origin] - transform-origin position
    * @param {number} [e.isInstant] - Whether to execute the request instantly
    * @return {Moveable.Requester} Moveable Requester
    * @example

    * // Instantly Request (requestStart - request - requestEnd)
    * // Use Relative Value
    * moveable.request("originDraggable", { deltaX: 10, deltaY: 10 }, true);
    * // Use Absolute Value
    * moveable.request("originDraggable", { x: 200, y: 100 }, true);
    * // Use Transform Value
    * moveable.request("originDraggable", { deltaOrigin: [10, 0] }, true);
    * moveable.request("originDraggable", { origin: [100, 0] }, true);
    * // requestStart
    * const requester = moveable.request("originDraggable");
    *
    * // request
    * // Use Relative Value
    * requester.request({ deltaX: 10, deltaY: 10 });
    * requester.request({ deltaX: 10, deltaY: 10 });
    * requester.request({ deltaX: 10, deltaY: 10 });
    * // Use Absolute Value
    * moveable.request("originDraggable", { x: 200, y: 100 });
    * moveable.request("originDraggable", { x: 220, y: 100 });
    * moveable.request("originDraggable", { x: 240, y: 100 });
    *
    * // requestEnd
    * requester.requestEnd();
    */
    request(moveable: MoveableManagerInterface<any, any>): {
        isControl: boolean;
        requestStart(): {
            datas: {};
        };
        request(e: IObject<any>): {
            datas: {};
            distX: number;
            distY: number;
            distOrigin: number[];
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
        };
    };
};
export default _default;
/**
 * Whether to drag origin (default: false)
 * @name Moveable.OriginDraggable#originDraggable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     originDraggable: true,
 * });
 * let translate = [0, 0];
 * moveable.on("dragOriginStart", e => {
 *     e.dragStart && e.dragStart.set(translate);
 * }).on("dragOrigin", e => {
 *     translate = e.drag.beforeTranslate;
 *     e.target.style.cssText
 *         = `transform-origin: ${e.transformOrigin};`
 *         + `transform: translate(${translate[0]}px, ${translate[1]}px)`;
 * }).on("dragOriginEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * % Can be used instead of the absolute px (default: true)
 * @name Moveable.OriginDraggable#originRelative
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     originDraggable: true,
 *     originRelative: false,
 * });
 * moveable.originRelative = true;
 */
/**
* When drag start the origin, the `dragOriginStart` event is called.
* @memberof Moveable.OriginDraggable
* @event dragOriginStart
* @param {Moveable.OriginDraggable.OnDragOriginStart} - Parameters for the `dragOriginStart` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     originDraggable: true,
* });
* let translate = [0, 0];
* moveable.on("dragOriginStart", e => {
*     e.dragStart && e.dragStart.set(translate);
* }).on("dragOrigin", e => {
*     translate = e.drag.beforeTranslate;
*     e.target.style.cssText
*         = `transform-origin: ${e.transformOrigin};`
*         + `transform: translate(${translate[0]}px, ${translate[1]}px)`;
* }).on("dragOriginEnd", e => {
*     console.log(e);
* });
*/
/**
* When drag the origin, the `dragOrigin` event is called.
* @memberof Moveable.OriginDraggable
* @event dragOrigin
* @param {Moveable.OriginDraggable.OnDragOrigin} - Parameters for the `dragOrigin` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     originDraggable: true,
* });
* let translate = [0, 0];
* moveable.on("dragOriginStart", e => {
*     e.dragStart && e.dragStart.set(translate);
* }).on("dragOrigin", e => {
*     translate = e.drag.beforeTranslate;
*     e.target.style.cssText
*         = `transform-origin: ${e.transformOrigin};`
*         + `transform: translate(${translate[0]}px, ${translate[1]}px)`;
* }).on("dragOriginEnd", e => {
*     console.log(e);
* });
*/
/**
* When drag end the origin, the `dragOriginEnd` event is called.
* @memberof Moveable.OriginDraggable
* @event dragOriginEnd
* @param {Moveable.OriginDraggable.OnDragOriginEnd} - Parameters for the `dragOriginEnd` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     originDraggable: true,
* });
* let translate = [0, 0];
* moveable.on("dragOriginStart", e => {
*     e.dragStart && e.dragStart.set(translate);
* }).on("dragOrigin", e => {
*     translate = e.drag.beforeTranslate;
*     e.target.style.cssText
*         = `transform-origin: ${e.transformOrigin};`
*         + `transform: translate(${translate[0]}px, ${translate[1]}px)`;
* }).on("dragOriginEnd", e => {
*     console.log(e);
* });
*/
