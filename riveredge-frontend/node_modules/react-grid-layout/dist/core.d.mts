import { f as LayoutConstraint, a as LayoutItem, g as ConstraintContext, d as ResizeHandleAxis } from './types-BiXsdXr7.mjs';
export { A as ArrayElement, B as Breakpoint, p as BreakpointCols, b as Breakpoints, C as CompactType, c as Compactor, r as DeepPartial, m as DragConfig, j as DragOverEvent, o as DropConfig, D as DroppingPosition, E as EventCallback, l as GridConfig, G as GridDragEvent, e as GridResizeEvent, L as Layout, M as Mutable, q as OnBreakpointChangeCallback, O as OnLayoutChangeCallback, h as PartialPosition, P as Position, k as PositionStrategy, i as ReactDraggableCallbackData, n as ResizeConfig, R as ResponsiveLayouts, S as Size, t as defaultDragConfig, v as defaultDropConfig, s as defaultGridConfig, u as defaultResizeConfig } from './types-BiXsdXr7.mjs';
export { c as collides, h as findOrGenerateResponsiveLayout, a as getAllCollisions, e as getBreakpointFromWidth, f as getColsFromBreakpoint, g as getFirstCollision, j as getIndentationValue, i as sortBreakpoints, s as sortLayoutItems, d as sortLayoutItemsByColRow, b as sortLayoutItemsByRowCol } from './responsive-T0N0GmBB.mjs';
export { A as absoluteStrategy, b as bottom, c as cloneLayout, a as cloneLayoutItem, u as compactItemHorizontal, t as compactItemVertical, k as correctBounds, B as createScaledStrategy, C as defaultPositionStrategy, d as getCompactor, g as getLayoutItem, i as getStatics, h as horizontalCompactor, p as horizontalOverlapCompactor, j as modifyLayout, m as moveElement, l as moveElementAwayFromCollision, n as noCompactor, q as noOverlapCompactor, x as perc, y as resizeItemInDirection, r as resolveCompactionCollision, f as setTopLeft, s as setTransform, z as transformStrategy, v as validateLayout, e as verticalCompactor, o as verticalOverlapCompactor, w as withLayoutItem } from './position-CetgOHhD.mjs';
export { d as GridCellConfig, G as GridCellDimensions, P as PositionParams, j as calcGridCellDimensions, e as calcGridColWidth, c as calcGridItemPosition, f as calcGridItemWHPx, b as calcWH, h as calcWHRaw, a as calcXY, g as calcXYRaw, i as clamp } from './calculate-FbCWy8x1.mjs';

/**
 * Pluggable layout constraints for react-grid-layout v2
 *
 * Constraints control position and size limits during drag/resize operations.
 * They are composable, tree-shakeable, and can be applied at grid or item level.
 */

/**
 * Grid boundary constraint.
 *
 * Ensures items stay within the grid bounds (0 to cols-w for x, 0 to maxRows-h for y).
 * This is the default position constraint.
 */
declare const gridBounds: LayoutConstraint;
/**
 * Min/max size constraint.
 *
 * Enforces per-item minW/maxW/minH/maxH properties.
 * This is applied by default after gridBounds.
 */
declare const minMaxSize: LayoutConstraint;
/**
 * Container bounds constraint.
 *
 * Constrains items to stay within the visible container.
 * Use this as a replacement for the legacy `isBounded` prop.
 *
 * Unlike gridBounds which uses maxRows (which may be Infinity),
 * this constraint calculates visible rows from the actual container height.
 * Falls back to maxRows if containerHeight is 0 (auto-height grids).
 */
declare const containerBounds: LayoutConstraint;
/**
 * Bounded X constraint.
 *
 * Only constrains horizontal position (x-axis).
 * Items can move freely in the vertical direction.
 */
declare const boundedX: LayoutConstraint;
/**
 * Bounded Y constraint.
 *
 * Only constrains vertical position (y-axis).
 * Items can move freely in the horizontal direction.
 */
declare const boundedY: LayoutConstraint;
/**
 * Create an aspect ratio constraint.
 *
 * Maintains a fixed width-to-height ratio **in pixels** during resize operations.
 * Accounts for the different pixel sizes of grid columns vs rows.
 *
 * @param ratio - Width-to-height ratio (e.g., 16/9 for widescreen, 1 for square)
 * @returns A constraint that enforces the aspect ratio
 *
 * @example
 * ```typescript
 * // 16:9 aspect ratio (actual pixel proportions)
 * const layout = [
 *   { i: 'video', x: 0, y: 0, w: 4, h: 2, constraints: [aspectRatio(16/9)] }
 * ];
 *
 * // Square items (in pixels, not grid units)
 * <GridLayout constraints={[gridBounds, minMaxSize, aspectRatio(1)]} />
 * ```
 */
declare function aspectRatio(ratio: number): LayoutConstraint;
/**
 * Create a snap-to-grid constraint.
 *
 * Snaps positions to multiples of the specified step values.
 * Useful for aligning items to a coarser grid.
 *
 * @param stepX - Horizontal snap step in grid units
 * @param stepY - Vertical snap step in grid units (defaults to stepX)
 * @returns A constraint that snaps positions to the grid
 *
 * @example
 * ```typescript
 * // Snap to every 2 grid units
 * <GridLayout constraints={[snapToGrid(2), gridBounds]} />
 *
 * // Different horizontal and vertical snap
 * <GridLayout constraints={[snapToGrid(2, 3), gridBounds]} />
 * ```
 */
declare function snapToGrid(stepX: number, stepY?: number): LayoutConstraint;
/**
 * Create a minimum size constraint.
 *
 * Sets minimum width and height for all items using this constraint.
 * Useful for grid-wide minimums without setting minW/minH on each item.
 *
 * @param minW - Minimum width in grid units
 * @param minH - Minimum height in grid units
 * @returns A constraint that enforces minimum size
 */
declare function minSize(minW: number, minH: number): LayoutConstraint;
/**
 * Create a maximum size constraint.
 *
 * Sets maximum width and height for all items using this constraint.
 * Useful for grid-wide maximums without setting maxW/maxH on each item.
 *
 * @param maxW - Maximum width in grid units
 * @param maxH - Maximum height in grid units
 * @returns A constraint that enforces maximum size
 */
declare function maxSize(maxW: number, maxH: number): LayoutConstraint;
/**
 * Default constraints applied when none are specified.
 *
 * Includes:
 * - gridBounds: Keep items within the grid
 * - minMaxSize: Respect per-item min/max constraints
 */
declare const defaultConstraints: LayoutConstraint[];
/**
 * Apply position constraints to a proposed position.
 *
 * Constraints are applied in array order, allowing composition.
 * Grid-level constraints are applied first, then per-item constraints.
 *
 * @param constraints - Array of constraints to apply
 * @param item - The layout item being positioned
 * @param x - Proposed x position
 * @param y - Proposed y position
 * @param context - Grid context (cols, maxRows, etc.)
 * @returns Constrained position
 */
declare function applyPositionConstraints(constraints: LayoutConstraint[], item: LayoutItem, x: number, y: number, context: ConstraintContext): {
    x: number;
    y: number;
};
/**
 * Apply size constraints to a proposed size.
 *
 * Constraints are applied in array order, allowing composition.
 * Grid-level constraints are applied first, then per-item constraints.
 *
 * @param constraints - Array of constraints to apply
 * @param item - The layout item being resized
 * @param w - Proposed width
 * @param h - Proposed height
 * @param handle - Which resize handle is being used
 * @param context - Grid context (cols, maxRows, etc.)
 * @returns Constrained size
 */
declare function applySizeConstraints(constraints: LayoutConstraint[], item: LayoutItem, w: number, h: number, handle: ResizeHandleAxis, context: ConstraintContext): {
    w: number;
    h: number;
};

export { ConstraintContext, LayoutConstraint, LayoutItem, ResizeHandleAxis, applyPositionConstraints, applySizeConstraints, aspectRatio, boundedX, boundedY, containerBounds, defaultConstraints, gridBounds, maxSize, minMaxSize, minSize, snapToGrid };
