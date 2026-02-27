import { L as Layout, a as LayoutItem, C as CompactType, M as Mutable, c as Compactor, P as Position, d as ResizeHandleAxis, k as PositionStrategy } from './types-BiXsdXr7.mjs';

/**
 * Core layout manipulation utilities.
 *
 * These functions create, modify, and query grid layouts.
 * All functions treat layouts as immutable - they return new arrays/objects.
 */

/**
 * Get the bottom-most Y coordinate of the layout.
 *
 * This is the Y position plus height of the lowest item.
 *
 * @param layout - Layout to measure
 * @returns The bottom Y coordinate (0 if layout is empty)
 */
declare function bottom(layout: Layout): number;
/**
 * Get a layout item by its ID.
 *
 * @param layout - Layout to search
 * @param id - Item ID to find
 * @returns The layout item, or undefined if not found
 */
declare function getLayoutItem(layout: Layout, id: string): LayoutItem | undefined;
/**
 * Get all static items from the layout.
 *
 * Static items cannot be moved or resized by the user.
 *
 * @param layout - Layout to filter
 * @returns Array of static layout items
 */
declare function getStatics(layout: Layout): LayoutItem[];
/**
 * Clone a layout item.
 *
 * Creates a shallow copy with all properties preserved.
 * Boolean properties are normalized (undefined becomes false).
 *
 * @param layoutItem - Item to clone
 * @returns A new layout item with the same properties
 */
declare function cloneLayoutItem(layoutItem: LayoutItem): LayoutItem;
/**
 * Clone an entire layout.
 *
 * Creates a new array with cloned items.
 *
 * @param layout - Layout to clone
 * @returns A new layout with cloned items
 */
declare function cloneLayout(layout: Layout): LayoutItem[];
/**
 * Replace a layout item in a layout.
 *
 * Returns a new layout with the item replaced. Other items are not cloned.
 *
 * @param layout - Layout to modify
 * @param layoutItem - New item (matched by `i` property)
 * @returns New layout with the item replaced
 */
declare function modifyLayout(layout: Layout, layoutItem: LayoutItem): LayoutItem[];
/**
 * Apply a transformation to a layout item.
 *
 * Finds the item by key, clones it, applies the callback, and returns
 * a new layout with the modified item.
 *
 * @param layout - Layout to modify
 * @param itemKey - Key of the item to modify
 * @param cb - Callback that receives the cloned item and returns the modified item
 * @returns Tuple of [new layout, modified item or null if not found]
 */
declare function withLayoutItem(layout: Layout, itemKey: string, cb: (item: LayoutItem) => LayoutItem): [LayoutItem[], LayoutItem | null];
/**
 * Ensure all layout items fit within the grid bounds.
 *
 * - Items overflowing right are moved left
 * - Items overflowing left are moved to x=0 and clamped to grid width
 * - Static items that collide with other statics are moved down
 *
 * **IMPORTANT**: This function mutates the layout items in place for performance.
 * The type signature uses `Mutable<LayoutItem>[]` to make this explicit.
 * Clone the layout first (e.g., with `cloneLayout()`) if you need immutability.
 *
 * @param layout - Layout to correct (items WILL be mutated)
 * @param bounds - Grid bounds
 * @returns The same layout array (for chaining)
 */
declare function correctBounds(layout: Mutable<LayoutItem>[], bounds: {
    cols: number;
}): LayoutItem[];
/**
 * Move a layout element to a new position.
 *
 * Handles collision detection and cascading movements.
 * Does not compact the layout - call `compact()` separately.
 *
 * **Note**: This function mutates the `l` parameter directly for performance.
 * The item's x, y, and moved properties will be modified. Callers should
 * ideally pass a cloned item if they need to preserve the original.
 *
 * @param layout - Full layout
 * @param l - Item to move (will be mutated)
 * @param x - New X position (or undefined to keep current)
 * @param y - New Y position (or undefined to keep current)
 * @param isUserAction - True if this is a direct user action (affects collision resolution)
 * @param preventCollision - True to block movement into occupied space (item snaps back). No effect if allowOverlap is true.
 * @param compactType - Compaction type for collision resolution
 * @param cols - Number of columns in the grid
 * @param allowOverlap - True to allow items to stack on top of each other
 * @returns The updated layout
 */
declare function moveElement(layout: Layout, l: LayoutItem, x: number | undefined, y: number | undefined, isUserAction: boolean | undefined, preventCollision: boolean | undefined, compactType: CompactType, cols: number, allowOverlap?: boolean): LayoutItem[];
/**
 * Move an item away from a collision.
 *
 * Attempts to move the item up/left first if there's room,
 * otherwise moves it down/right.
 *
 * @param layout - Full layout
 * @param collidesWith - The item being collided with
 * @param itemToMove - The item to move away
 * @param isUserAction - True if this is a direct user action
 * @param compactType - Compaction type
 * @param cols - Number of columns
 * @returns Updated layout
 */
declare function moveElementAwayFromCollision(layout: Layout, collidesWith: LayoutItem, itemToMove: LayoutItem, isUserAction: boolean | undefined, compactType: CompactType, cols: number): LayoutItem[];
/**
 * Validate that a layout has the required properties.
 *
 * @param layout - Layout to validate
 * @param contextName - Name for error messages
 * @throws Error if layout is invalid
 */
declare function validateLayout(layout: Layout, contextName?: string): void;

/**
 * Compactor implementations.
 *
 * Compactors are pluggable strategies for removing gaps between grid items.
 * Use the Compactor interface to create custom compaction algorithms.
 */

/**
 * Resolve a compaction collision by moving items.
 *
 * Before moving an item to a position, checks if that movement would
 * cause collisions and recursively moves those items first.
 *
 * Useful for implementing custom compactors.
 *
 * @param layout - Full layout (must be sorted for optimization)
 * @param item - Item being moved (will be mutated)
 * @param moveToCoord - Target coordinate
 * @param axis - Which axis to move on ('x' or 'y')
 * @param hasStatics - Whether layout contains static items (disables early break optimization)
 */
declare function resolveCompactionCollision(layout: Layout, item: LayoutItem, moveToCoord: number, axis: "x" | "y", hasStatics?: boolean): void;
/**
 * Compact a single item vertically (move up).
 *
 * Moves the item as far up as possible without colliding.
 * Useful for implementing custom vertical compactors.
 *
 * @param compareWith - Items to check for collisions
 * @param l - Item to compact (will be mutated)
 * @param fullLayout - Full layout for collision resolution
 * @param maxY - Maximum Y to start from
 * @returns The compacted item
 */
declare function compactItemVertical(compareWith: Layout, l: LayoutItem, fullLayout: Layout, maxY: number): LayoutItem;
/**
 * Compact a single item horizontally (move left).
 *
 * Moves the item as far left as possible without colliding.
 * Wraps to the next row if it overflows.
 * Useful for implementing custom horizontal compactors.
 *
 * @param compareWith - Items to check for collisions
 * @param l - Item to compact (will be mutated)
 * @param cols - Number of columns in the grid
 * @param fullLayout - Full layout for collision resolution
 * @returns The compacted item
 */
declare function compactItemHorizontal(compareWith: Layout, l: LayoutItem, cols: number, fullLayout: Layout): LayoutItem;
/**
 * Vertical compactor - moves items up to fill gaps.
 *
 * Items are sorted by row then column, and each item is moved
 * as far up as possible without overlapping other items.
 *
 * This is the default compaction mode for react-grid-layout.
 */
declare const verticalCompactor: Compactor;
/**
 * Horizontal compactor - moves items left to fill gaps.
 *
 * Items are sorted by column then row, and each item is moved
 * as far left as possible without overlapping other items.
 */
declare const horizontalCompactor: Compactor;
/**
 * No compaction - items stay where placed.
 *
 * Use this for free-form layouts where items can be placed anywhere.
 * Items will not automatically move to fill gaps.
 */
declare const noCompactor: Compactor;
/**
 * Vertical compactor that allows overlapping items.
 *
 * Items compact upward but are allowed to overlap each other.
 * Useful for layered layouts or when collision detection is handled externally.
 */
declare const verticalOverlapCompactor: Compactor;
/**
 * Horizontal compactor that allows overlapping items.
 */
declare const horizontalOverlapCompactor: Compactor;
/**
 * No compaction, with overlapping allowed.
 *
 * Items stay where placed and can overlap each other.
 */
declare const noOverlapCompactor: Compactor;
/**
 * Get a compactor by type.
 *
 * This is a convenience function for backwards compatibility with the
 * string-based compactType API.
 *
 * Note: For 'wrap' mode, import `wrapCompactor` from 'react-grid-layout/extras'
 * and pass it directly to the `compactor` prop. This function returns
 * `noCompactor` for 'wrap' type since the wrap compactor is tree-shakeable.
 *
 * @param compactType - 'vertical', 'horizontal', 'wrap', or null
 * @param allowOverlap - Whether to allow overlapping items
 * @returns The appropriate Compactor
 */
declare function getCompactor(compactType: CompactType, allowOverlap?: boolean, preventCollision?: boolean): Compactor;

/**
 * Position calculation utilities.
 *
 * These functions convert between grid units and pixel positions,
 * and generate CSS styles for grid items.
 */

/**
 * Generate CSS transform-based positioning styles.
 *
 * Using transforms is more performant than top/left positioning
 * because it doesn't trigger layout recalculations.
 *
 * @param position - Position in pixels
 * @returns CSS style object
 */
declare function setTransform({ top, left, width, height }: Position): Record<string, string>;
/**
 * Generate CSS top/left positioning styles.
 *
 * Use this when transforms are not suitable (e.g., for printing
 * or when transform causes issues with child elements).
 *
 * @param position - Position in pixels
 * @returns CSS style object
 */
declare function setTopLeft({ top, left, width, height }: Position): Record<string, string>;
/**
 * Convert a number to a percentage string.
 *
 * @param num - Number to convert (0-1 range typically)
 * @returns Percentage string (e.g., "50%")
 */
declare function perc(num: number): string;
/**
 * Resize an item in a specific direction, clamping to container bounds.
 *
 * This handles the complex logic of resizing from different edges/corners,
 * ensuring the item doesn't overflow the container.
 *
 * @param direction - Which edge/corner is being dragged
 * @param currentSize - Current position and size
 * @param newSize - Requested new position and size
 * @param containerWidth - Width of the container
 * @returns Constrained position and size
 */
declare function resizeItemInDirection(direction: ResizeHandleAxis, currentSize: Position, newSize: Position, containerWidth: number): Position;
/**
 * CSS transform-based positioning strategy.
 *
 * Uses CSS transforms for positioning, which is more performant
 * as it doesn't trigger layout recalculations.
 *
 * This is the default strategy.
 */
declare const transformStrategy: PositionStrategy;
/**
 * Absolute (top/left) positioning strategy.
 *
 * Uses CSS top/left for positioning. Use this when CSS transforms
 * cause issues (e.g., printing, certain child element positioning).
 */
declare const absoluteStrategy: PositionStrategy;
/**
 * Create a scaled transform strategy.
 *
 * Use this when the grid container is inside a scaled element
 * (e.g., `transform: scale(0.5)`). The scale factor adjusts
 * drag/resize calculations to account for the parent transform.
 *
 * @param scale - Scale factor (e.g., 0.5 for half size)
 * @returns Position strategy with scaled calculations
 *
 * @example
 * ```tsx
 * <div style={{ transform: 'scale(0.5)' }}>
 *   <GridLayout positionStrategy={createScaledStrategy(0.5)} />
 * </div>
 * ```
 */
declare function createScaledStrategy(scale: number): PositionStrategy;
/** Default position strategy (transform-based) */
declare const defaultPositionStrategy: PositionStrategy;

export { absoluteStrategy as A, createScaledStrategy as B, defaultPositionStrategy as C, cloneLayoutItem as a, bottom as b, cloneLayout as c, getCompactor as d, verticalCompactor as e, setTopLeft as f, getLayoutItem as g, horizontalCompactor as h, getStatics as i, modifyLayout as j, correctBounds as k, moveElementAwayFromCollision as l, moveElement as m, noCompactor as n, verticalOverlapCompactor as o, horizontalOverlapCompactor as p, noOverlapCompactor as q, resolveCompactionCollision as r, setTransform as s, compactItemVertical as t, compactItemHorizontal as u, validateLayout as v, withLayoutItem as w, perc as x, resizeItemInDirection as y, transformStrategy as z };
