import { ScrollableProps, MoveableManagerInterface, MoveableGroupInterface } from "../types";
/**
 * @namespace Moveable.Scrollable
 * @description Whether or not target can be scrolled to the scroll container (default: false)
 */
declare const _default: {
    name: string;
    canPinch: boolean;
    props: readonly ["scrollable", "scrollContainer", "scrollThreshold", "scrollThrottleTime", "getScrollPosition", "scrollOptions"];
    events: readonly ["scroll", "scrollGroup"];
    dragRelation: string;
    dragStart(moveable: MoveableManagerInterface<ScrollableProps, Record<string, any>>, e: any): void;
    checkScroll(moveable: MoveableManagerInterface<ScrollableProps>, e: any): true | undefined;
    drag(moveable: MoveableManagerInterface<ScrollableProps>, e: any): true | undefined;
    dragEnd(moveable: MoveableManagerInterface<ScrollableProps>, e: any): void;
    dragControlStart(moveable: MoveableManagerInterface<ScrollableProps>, e: any): void;
    dragControl(moveable: MoveableManagerInterface<ScrollableProps>, e: any): true | undefined;
    dragControlEnd(moveable: MoveableManagerInterface<ScrollableProps>, e: any): void;
    dragGroupStart(moveable: MoveableGroupInterface, e: any): void;
    dragGroup(moveable: MoveableGroupInterface, e: any): true | undefined;
    dragGroupEnd(moveable: MoveableGroupInterface, e: any): void;
    dragGroupControlStart(moveable: MoveableGroupInterface, e: any): void;
    dragGroupControl(moveable: MoveableGroupInterface, e: any): true | undefined;
    dragGroupControEnd(moveable: MoveableGroupInterface, e: any): void;
    unset(moveable: MoveableManagerInterface<ScrollableProps, Record<string, any>>): void;
};
export default _default;
/**
 * When the drag cursor leaves the scrollContainer, the `scroll` event occur to scroll.
 * @memberof Moveable.Scrollable
 * @event scroll
 * @param {Moveable.Scrollable.OnScroll} - Parameters for the `scroll` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("scroll", ({ scrollContainer, direction }) => {
 *   scrollContainer.scrollLeft += direction[0] * 10;
 *   scrollContainer.scrollTop += direction[1] * 10;
 * });
 */
/**
 * When the drag cursor leaves the scrollContainer, the `scrollGroup` event occur to scroll in group.
 * @memberof Moveable.Scrollable
 * @event scrollGroup
 * @param {Moveable.Scrollable.OnScrollGroup} - Parameters for the `scrollGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("scroll", ({ scrollContainer, direction }) => {
 *   scrollContainer.scrollLeft += direction[0] * 10;
 *   scrollContainer.scrollTop += direction[1] * 10;
 * });
 */
