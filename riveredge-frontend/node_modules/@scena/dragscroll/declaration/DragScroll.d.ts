import EventEmitter from "@scena/event-emitter";
import { CheckScrollOptions, DragScrollEvents, DragScrollOptions } from "./types";
/**
 * @sort 1
 */
declare class DragScroll extends EventEmitter<DragScrollEvents> {
    private _startRect;
    private _startPos;
    private _prevTime;
    private _timer;
    private _prevScrollPos;
    private _isWait;
    private _flag;
    private _currentOptions;
    private _lock;
    private _unregister;
    /**
     */
    dragStart(e: any, options: DragScrollOptions): void;
    drag(e: any, options: DragScrollOptions): boolean;
    /**
     */
    checkScroll(options: CheckScrollOptions): boolean;
    /**
     *
     */
    dragEnd(): void;
    private _getScrollPosition;
    private _continueDrag;
    private _registerScrollEvent;
    private _unregisterScrollEvent;
    private _onScroll;
}
export default DragScroll;
