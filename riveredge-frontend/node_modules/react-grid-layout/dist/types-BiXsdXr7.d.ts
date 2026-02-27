/**
 * Core types for react-grid-layout v2
 *
 * These types are framework-agnostic and define the data structures
 * used by the layout algorithms.
 */
/**
 * Axis identifiers for resize handles.
 * - Cardinal: 'n', 's', 'e', 'w' (north, south, east, west)
 * - Diagonal: 'ne', 'nw', 'se', 'sw'
 */
type ResizeHandleAxis = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
/**
 * A single item in the grid layout.
 *
 * Position (x, y) is in grid units, not pixels.
 * Size (w, h) is in grid units.
 */
interface LayoutItem {
    /** Unique identifier for this item */
    i: string;
    /** X position in grid units (0-indexed from left) */
    x: number;
    /** Y position in grid units (0-indexed from top) */
    y: number;
    /** Width in grid units */
    w: number;
    /** Height in grid units */
    h: number;
    /** Minimum width in grid units */
    minW?: number;
    /** Minimum height in grid units */
    minH?: number;
    /** Maximum width in grid units */
    maxW?: number;
    /** Maximum height in grid units */
    maxH?: number;
    /**
     * If true, item cannot be dragged or resized, and other items
     * will move around it during compaction.
     */
    static?: boolean;
    /**
     * If false, item cannot be dragged (but may still be resizable).
     * Overrides grid-level isDraggable for this item.
     */
    isDraggable?: boolean;
    /**
     * If false, item cannot be resized (but may still be draggable).
     * Overrides grid-level isResizable for this item.
     */
    isResizable?: boolean;
    /**
     * Which resize handles to show for this item.
     * Overrides grid-level resizeHandles for this item.
     */
    resizeHandles?: ResizeHandleAxis[];
    /**
     * If true, item is constrained to the grid container bounds.
     * Overrides grid-level isBounded for this item.
     */
    isBounded?: boolean;
    /**
     * Internal flag set during drag/resize operations to indicate
     * the item has moved from its original position.
     * @internal
     */
    moved?: boolean;
    /**
     * Per-item layout constraints.
     * Applied in addition to grid-level constraints.
     */
    constraints?: LayoutConstraint[];
}
/**
 * A layout is a readonly array of layout items.
 * Layouts should be treated as immutable.
 */
type Layout = readonly LayoutItem[];
/**
 * Pixel position and size of an element.
 */
interface Position {
    left: number;
    top: number;
    width: number;
    height: number;
}
/**
 * Partial position (just coordinates, no size).
 */
interface PartialPosition {
    left: number;
    top: number;
}
/**
 * Size in pixels.
 */
interface Size {
    width: number;
    height: number;
}
/**
 * Position when dropping an external element onto the grid.
 */
interface DroppingPosition {
    left: number;
    top: number;
    e: Event;
}
/**
 * Data provided by react-draggable during drag operations.
 */
interface ReactDraggableCallbackData {
    node: HTMLElement;
    x?: number;
    y?: number;
    deltaX: number;
    deltaY: number;
    lastX?: number;
    lastY?: number;
}
/**
 * Grid-level drag event data.
 */
interface GridDragEvent {
    e: Event;
    node: HTMLElement;
    newPosition: PartialPosition;
}
/**
 * Grid-level resize event data.
 */
interface GridResizeEvent {
    e: Event;
    node: HTMLElement;
    size: Size;
    handle: ResizeHandleAxis;
}
/**
 * Drag-over event with layer coordinates.
 */
interface DragOverEvent extends MouseEvent {
    nativeEvent: Event & {
        layerX: number;
        layerY: number;
    };
}
/**
 * Type of compaction to apply to the layout.
 * - 'vertical': Items compact upward (default)
 * - 'horizontal': Items compact leftward
 * - 'wrap': Items arranged in wrapped-paragraph style (like words in text)
 * - null: No compaction (free-form positioning)
 */
type CompactType = "horizontal" | "vertical" | "wrap" | null;
/**
 * Standard callback signature for layout change events.
 *
 * @param layout - The current layout after the change
 * @param oldItem - The item before the change (null if not applicable)
 * @param newItem - The item after the change (null if not applicable)
 * @param placeholder - The placeholder item during drag/resize (null at start)
 * @param event - The DOM event that triggered the change
 * @param element - The DOM element being manipulated (null if not applicable)
 */
type EventCallback = (layout: Layout, oldItem: LayoutItem | null, newItem: LayoutItem | null, placeholder: LayoutItem | null, event: Event, element: HTMLElement | null) => void;
/**
 * Callback when layout changes for any reason.
 */
type OnLayoutChangeCallback = (layout: Layout) => void;
/**
 * Interface for layout compaction strategies.
 *
 * Implement this interface to create custom compaction algorithms.
 *
 * @example
 * ```typescript
 * const myCompactor: Compactor = {
 *   type: 'vertical',
 *   allowOverlap: false,
 *   compact(layout, cols) {
 *     // Custom compaction logic
 *     return compactedLayout;
 *   }
 * };
 * ```
 */
interface Compactor {
    /** Compaction type identifier */
    readonly type: CompactType;
    /**
     * Whether items can overlap (stack on top of each other).
     *
     * When true:
     * - Items can be placed on top of other items
     * - Dragging into another item does NOT push it away
     * - Compaction is skipped after drag/resize
     */
    readonly allowOverlap: boolean;
    /**
     * Whether to block movement that would cause collision.
     *
     * When true (and allowOverlap is false):
     * - Dragging into another item is blocked (item snaps back)
     * - Other items are NOT pushed away
     * - Only affects drag/resize, not compaction
     *
     * Has no effect when allowOverlap is true.
     */
    readonly preventCollision?: boolean;
    /**
     * Compact the layout.
     *
     * @param layout - The layout to compact
     * @param cols - Number of columns in the grid
     * @returns The compacted layout
     */
    compact(layout: Layout, cols: number): Layout;
}
/**
 * Interface for CSS positioning strategies.
 *
 * Implement this interface to customize how items are positioned in the DOM.
 * Built-in strategies: transformStrategy, absoluteStrategy.
 *
 * @example
 * ```typescript
 * // Use transform-based positioning (default, better performance)
 * <GridLayout positionStrategy={transformStrategy} />
 *
 * // Use top/left positioning (for environments where transforms cause issues)
 * <GridLayout positionStrategy={absoluteStrategy} />
 *
 * // Use scaled transforms (for scaled containers)
 * <GridLayout positionStrategy={createScaledStrategy(0.5)} />
 * ```
 */
interface PositionStrategy {
    /** Strategy type identifier */
    readonly type: "transform" | "absolute";
    /** Scale factor for drag/resize calculations */
    readonly scale: number;
    /**
     * Convert pixel position to CSS style object.
     *
     * @param pos - Position in pixels
     * @returns CSS properties for positioning the element
     */
    calcStyle(pos: Position): React.CSSProperties;
    /**
     * Calculate position during drag operations, accounting for transforms and scale.
     *
     * This method is optional. When not provided, react-draggable uses its built-in
     * parent-relative coordinate calculation. Only override this when you need custom
     * coordinate handling, such as for scaled containers.
     *
     * @param clientX - Mouse client X position
     * @param clientY - Mouse client Y position
     * @param offsetX - Offset from element origin X
     * @param offsetY - Offset from element origin Y
     * @returns Adjusted left/top position
     */
    calcDragPosition?(clientX: number, clientY: number, offsetX: number, offsetY: number): PartialPosition;
}
/**
 * Context provided to constraint functions during drag/resize operations.
 */
interface ConstraintContext {
    /** Number of columns in the grid */
    cols: number;
    /** Maximum number of rows (Infinity if unbounded) */
    maxRows: number;
    /** Container width in pixels */
    containerWidth: number;
    /** Container height in pixels (may be 0 if auto-height) */
    containerHeight: number;
    /** Row height in pixels */
    rowHeight: number;
    /** Margin between items [x, y] in pixels */
    margin: readonly [number, number];
    /** Current layout state */
    layout: Layout;
}
/**
 * Interface for layout constraints.
 *
 * Implement this interface to create custom position/size constraints.
 * Built-in constraints: gridBounds, minMaxSize, containerBounds, boundedX, boundedY.
 *
 * @example
 * ```typescript
 * // Grid-level constraints
 * <GridLayout constraints={[gridBounds, minMaxSize, aspectRatio(16/9)]} />
 *
 * // Per-item constraints
 * const layout = [
 *   { i: 'video', x: 0, y: 0, w: 4, h: 2, constraints: [aspectRatio(16/9)] }
 * ];
 * ```
 */
interface LayoutConstraint {
    /** Constraint identifier for debugging */
    readonly name: string;
    /**
     * Constrain position during drag operations.
     * Called after grid unit conversion, before layout update.
     *
     * @param item - The item being dragged
     * @param x - Proposed x position in grid units
     * @param y - Proposed y position in grid units
     * @param context - Grid context (cols, maxRows, etc.)
     * @returns Constrained x, y position
     */
    constrainPosition?(item: LayoutItem, x: number, y: number, context: ConstraintContext): {
        x: number;
        y: number;
    };
    /**
     * Constrain size during resize operations.
     * Called after grid unit conversion, before layout update.
     *
     * @param item - The item being resized
     * @param w - Proposed width in grid units
     * @param h - Proposed height in grid units
     * @param handle - Which resize handle is being used
     * @param context - Grid context (cols, maxRows, etc.)
     * @returns Constrained w, h size
     */
    constrainSize?(item: LayoutItem, w: number, h: number, handle: ResizeHandleAxis, context: ConstraintContext): {
        w: number;
        h: number;
    };
}
/**
 * Grid measurement configuration.
 * Groups all grid metrics (columns, row height, margins).
 */
interface GridConfig {
    /** Number of columns in the grid (default: 12) */
    cols: number;
    /** Height of a single row in pixels (default: 150) */
    rowHeight: number;
    /** [horizontal, vertical] margin between items in pixels (default: [10, 10]) */
    margin: readonly [number, number];
    /** [horizontal, vertical] padding inside the container (default: null, uses margin) */
    containerPadding: readonly [number, number] | null;
    /** Maximum number of rows (default: Infinity) */
    maxRows: number;
}
/** Default grid configuration */
declare const defaultGridConfig: GridConfig;
/**
 * Drag behavior configuration.
 * Groups all drag-related settings.
 */
interface DragConfig {
    /** Whether items can be dragged (default: true) */
    enabled: boolean;
    /** Whether items are bounded to the container (default: false) */
    bounded: boolean;
    /** CSS selector for drag handle (e.g., '.drag-handle') */
    handle?: string;
    /** CSS selector for elements that should not trigger drag */
    cancel?: string;
    /**
     * Minimum pixels to move before drag starts.
     * Helps distinguish click from drag (fixes #1341, #1401).
     * @default 3
     */
    threshold: number;
}
/** Default drag configuration */
declare const defaultDragConfig: DragConfig;
/**
 * Resize behavior configuration.
 * Groups all resize-related settings.
 */
interface ResizeConfig {
    /** Whether items can be resized (default: true) */
    enabled: boolean;
    /** Which resize handles to show (default: ['se']) */
    handles: readonly ResizeHandleAxis[];
    /**
     * Custom resize handle component.
     * Can be a React node or a function that receives the axis.
     */
    handleComponent?: React.ReactNode | ((axis: ResizeHandleAxis, ref: React.Ref<HTMLElement>) => React.ReactNode);
}
/** Default resize configuration */
declare const defaultResizeConfig: ResizeConfig;
/**
 * Drop configuration (for dropping external elements).
 * Groups all drop-related settings.
 */
interface DropConfig {
    /** Whether external elements can be dropped on the grid (default: false) */
    enabled: boolean;
    /** Default size for dropped items (default: { w: 1, h: 1 }) */
    defaultItem: {
        w: number;
        h: number;
    };
    /**
     * Called when dragging over the grid.
     * Return dimensions to override defaultItem, or false to reject the drop.
     * Can also return dragOffsetX/dragOffsetY to specify cursor offset for centering.
     */
    onDragOver?: (e: DragEvent) => {
        w?: number;
        h?: number;
        dragOffsetX?: number;
        dragOffsetY?: number;
    } | false | void;
}
/** Default drop configuration */
declare const defaultDropConfig: DropConfig;
/**
 * Breakpoint name (e.g., 'lg', 'md', 'sm', 'xs', 'xxs').
 */
type Breakpoint = string;
/**
 * Map of breakpoint name to pixel width.
 * Generic type B allows custom breakpoint strings.
 */
type Breakpoints<B extends Breakpoint = Breakpoint> = Record<B, number>;
/**
 * Map of breakpoint name to number of columns.
 * Generic type B allows custom breakpoint strings.
 */
type BreakpointCols<B extends Breakpoint = Breakpoint> = Record<B, number>;
/**
 * Map of breakpoint name to layout.
 * Generic type B allows custom breakpoint strings.
 */
type ResponsiveLayouts<B extends Breakpoint = Breakpoint> = Partial<Record<B, Layout>>;
/**
 * Callback when breakpoint changes.
 */
type OnBreakpointChangeCallback<B extends Breakpoint = Breakpoint> = (newBreakpoint: B, cols: number) => void;
/**
 * Makes all properties in T mutable (removes readonly).
 */
type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
/**
 * Deep partial - all properties and nested properties are optional.
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
/**
 * Extract the element type from an array type.
 */
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

export { type ArrayElement as A, type Breakpoint as B, type CompactType as C, type DroppingPosition as D, type EventCallback as E, type GridDragEvent as G, type Layout as L, type Mutable as M, type OnLayoutChangeCallback as O, type Position as P, type ResponsiveLayouts as R, type Size as S, type LayoutItem as a, type Breakpoints as b, type Compactor as c, type ResizeHandleAxis as d, type GridResizeEvent as e, type LayoutConstraint as f, type ConstraintContext as g, type PartialPosition as h, type ReactDraggableCallbackData as i, type DragOverEvent as j, type PositionStrategy as k, type GridConfig as l, type DragConfig as m, type ResizeConfig as n, type DropConfig as o, type BreakpointCols as p, type OnBreakpointChangeCallback as q, type DeepPartial as r, defaultGridConfig as s, defaultDragConfig as t, defaultResizeConfig as u, defaultDropConfig as v };
