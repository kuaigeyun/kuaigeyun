import { Renderer, ClippableProps, ClippableState, ControlPose, MoveableManagerInterface, DraggableProps } from "../types";
export declare function moveControlPos(controlPoses: ControlPose[], index: number, dist: number[], isRect?: boolean, keepRatio?: boolean): number[][];
/**
 * @namespace Moveable.Clippable
 * @description Whether to clip the target.
 */
declare const _default: {
    name: string;
    props: readonly ["clippable", "defaultClipPath", "customClipPath", "keepRatio", "clipRelative", "clipArea", "dragWithClip", "clipTargetBounds", "clipVerticalGuidelines", "clipHorizontalGuidelines", "clipSnapThreshold"];
    events: readonly ["clipStart", "clip", "clipEnd"];
    css: string[];
    render(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, React: Renderer): any[];
    dragControlCondition(moveable: any, e: any): any;
    dragStart(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any): boolean;
    drag(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any): boolean;
    dragEnd(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any): any;
    dragControlStart(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any): boolean;
    dragControl(moveable: MoveableManagerInterface<ClippableProps & DraggableProps, ClippableState>, e: any): boolean;
    dragControlEnd(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any): any;
    unset(moveable: MoveableManagerInterface<ClippableProps, ClippableState>): void;
};
export default _default;
/**
 * Whether to clip the target. (default: false)
 * @name Moveable.Clippable#clippable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 *  If clippath is not set, the default value can be set. (defaultClipPath < style < customClipPath < dragging clipPath)
 * @name Moveable.Clippable#defaultClipPath
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * % Can be used instead of the absolute px (`rect` not possible) (default: false)
 * @name Moveable.Clippable#clipRelative
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * You can force the custom clipPath. (defaultClipPath < style < customClipPath < dragging clipPath)
 * @name Moveable.Clippable#customClipPath
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When dragging the target, the clip also moves. (default: true)
 * @name Moveable.Clippable#dragWithClip
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * You can drag the clip by setting clipArea.
 * @name Moveable.Clippable#clipArea
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
* Whether the clip is bound to the target.
* @name Moveable.Clippable#clipTargetBounds
* @default false
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     clippable: true,
*     defaultClipPath: "inset",
*     customClipPath: "",
*     clipRelative: false,
*     clipArea: false,
*     dragWithClip: true,
*     clipTargetBounds: true,
* });
* moveable.on("clipStart", e => {
*     console.log(e);
* }).on("clip", e => {
*     if (e.clipType === "rect") {
*         e.target.style.clip = e.clipStyle;
*     } else {
*         e.target.style.clipPath = e.clipStyle;
*     }
* }).on("clipEnd", e => {
*     console.log(e);
* });
*/
/**
 * Add clip guidelines in the vertical direction.
 * @name Moveable.Clippable#clipVerticalGuidelines
 * @default 0
 * @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     clippable: true,
*     defaultClipPath: "inset",
*     customClipPath: "",
*     clipRelative: false,
*     clipArea: false,
*     dragWithClip: true,
*     clipVerticalGuidelines: [0, 100, 200],
*     clipHorizontalGuidelines: [0, 100, 200],
*     clipSnapThreshold: 5,
* });
*/
/**
* Add clip guidelines in the horizontal direction.
* @name Moveable.Clippable#clipHorizontalGuidelines
* @default []
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     clippable: true,
*     defaultClipPath: "inset",
*     customClipPath: "",
*     clipRelative: false,
*     clipArea: false,
*     dragWithClip: true,
*     clipVerticalGuidelines: [0, 100, 200],
*     clipHorizontalGuidelines: [0, 100, 200],
*     clipSnapThreshold: 5,
* });
*/
/**
* istance value that can snap to clip guidelines.
* @name Moveable.Clippable#clipSnapThreshold
* @default 5
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     clippable: true,
*     defaultClipPath: "inset",
*     customClipPath: "",
*     clipRelative: false,
*     clipArea: false,
*     dragWithClip: true,
*     clipVerticalGuidelines: [0, 100, 200],
*     clipHorizontalGuidelines: [0, 100, 200],
*     clipSnapThreshold: 5,
* });
*/
/**
 * When drag start the clip area or controls, the `clipStart` event is called.
 * @memberof Moveable.Clippable
 * @event clipStart
 * @param {Moveable.Clippable.OnClipStart} - Parameters for the `clipStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag the clip area or controls, the `clip` event is called.
 * @memberof Moveable.Clippable
 * @event clip
 * @param {Moveable.Clippable.OnClip} - Parameters for the `clip` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag end the clip area or controls, the `clipEnd` event is called.
 * @memberof Moveable.Clippable
 * @event clipEnd
 * @param {Moveable.Clippable.OnClipEnd} - Parameters for the `clipEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
