import { a as LayoutItem, L as Layout, C as CompactType, B as Breakpoint, b as Breakpoints, R as ResponsiveLayouts, c as Compactor } from './types-BiXsdXr7.js';

/**
 * Collision detection utilities for grid layouts.
 *
 * These functions determine if and where layout items overlap.
 */

/**
 * Check if two layout items collide (overlap).
 *
 * Two items collide if their bounding boxes overlap and they are
 * not the same item.
 *
 * @param l1 - First layout item
 * @param l2 - Second layout item
 * @returns true if the items collide
 */
declare function collides(l1: LayoutItem, l2: LayoutItem): boolean;
/**
 * Find the first item in the layout that collides with the given item.
 *
 * @param layout - Layout to search
 * @param layoutItem - Item to check for collisions
 * @returns The first colliding item, or undefined if none
 */
declare function getFirstCollision(layout: Layout, layoutItem: LayoutItem): LayoutItem | undefined;
/**
 * Find all items in the layout that collide with the given item.
 *
 * @param layout - Layout to search
 * @param layoutItem - Item to check for collisions
 * @returns Array of all colliding items (may be empty)
 */
declare function getAllCollisions(layout: Layout, layoutItem: LayoutItem): LayoutItem[];

/**
 * Sorting utilities for grid layouts.
 *
 * These functions sort layout items for compaction and iteration.
 */

/**
 * Sort layout items based on the compaction type.
 *
 * - Vertical compaction: sort by row (y) then column (x)
 * - Horizontal compaction: sort by column (x) then row (y)
 * - No compaction (null): return original order
 *
 * Does not modify the original layout.
 *
 * @param layout - Layout to sort
 * @param compactType - Type of compaction
 * @returns Sorted layout
 */
declare function sortLayoutItems(layout: Layout, compactType: CompactType): LayoutItem[];
/**
 * Sort layout items by row ascending, then column ascending.
 *
 * Items are ordered from top-left to bottom-right, row by row.
 * This is the natural reading order for vertical compaction.
 *
 * Does not modify the original layout.
 *
 * @param layout - Layout to sort
 * @returns Sorted array of layout items
 */
declare function sortLayoutItemsByRowCol(layout: Layout): LayoutItem[];
/**
 * Sort layout items by column ascending, then row ascending.
 *
 * Items are ordered from top-left to bottom-right, column by column.
 * This is the natural order for horizontal compaction.
 *
 * Does not modify the original layout.
 *
 * @param layout - Layout to sort
 * @returns Sorted array of layout items
 */
declare function sortLayoutItemsByColRow(layout: Layout): LayoutItem[];

/**
 * Responsive layout utilities.
 *
 * Functions for handling responsive breakpoints and layout generation.
 */

/**
 * Sort breakpoints by width (ascending).
 *
 * Returns an array of breakpoint names sorted from smallest to largest.
 * E.g., ['xxs', 'xs', 'sm', 'md', 'lg']
 *
 * @param breakpoints - Map of breakpoint names to widths
 * @returns Sorted array of breakpoint names
 */
declare function sortBreakpoints<B extends Breakpoint>(breakpoints: Breakpoints<B>): B[];
/**
 * Get the active breakpoint for a given width.
 *
 * Returns the highest breakpoint that is valid for the width (width > breakpoint).
 *
 * @param breakpoints - Map of breakpoint names to widths
 * @param width - Container width in pixels
 * @returns Active breakpoint name
 */
declare function getBreakpointFromWidth<B extends Breakpoint>(breakpoints: Breakpoints<B>, width: number): B;
/**
 * Get the column count for a breakpoint.
 *
 * @param breakpoint - Breakpoint name
 * @param cols - Map of breakpoint names to column counts
 * @returns Number of columns for the breakpoint
 * @throws Error if breakpoint is not defined in cols
 */
declare function getColsFromBreakpoint<B extends Breakpoint>(breakpoint: B, cols: Breakpoints<B>): number;
/**
 * Find or generate a layout for a breakpoint.
 *
 * If a layout exists for the breakpoint, returns a clone.
 * Otherwise, generates a new layout from the nearest larger breakpoint.
 *
 * @param layouts - Existing layouts by breakpoint
 * @param breakpoints - Breakpoint definitions
 * @param breakpoint - Target breakpoint
 * @param lastBreakpoint - Previous breakpoint (for fallback)
 * @param cols - Column count for the target breakpoint
 * @param compactTypeOrCompactor - Compaction type string (legacy) or Compactor object
 * @returns Layout for the breakpoint
 */
declare function findOrGenerateResponsiveLayout<B extends Breakpoint>(layouts: ResponsiveLayouts<B>, breakpoints: Breakpoints<B>, breakpoint: B, lastBreakpoint: B, cols: number, compactTypeOrCompactor: CompactType | Compactor): Layout;
type IndentationValue<B extends Breakpoint> = readonly [number, number] | Partial<Record<B, readonly [number, number]>>;
/**
 * Get margin or padding value for a breakpoint.
 *
 * Supports both fixed values ([x, y]) and breakpoint-specific values
 * ({ lg: [x, y], md: [x, y], ... }).
 *
 * @param value - Fixed value or breakpoint-specific map
 * @param breakpoint - Current breakpoint
 * @returns Margin/padding tuple [x, y]
 */
declare function getIndentationValue<B extends Breakpoint>(value: IndentationValue<B>, breakpoint: B): readonly [number, number];

export { getAllCollisions as a, sortLayoutItemsByRowCol as b, collides as c, sortLayoutItemsByColRow as d, getBreakpointFromWidth as e, getColsFromBreakpoint as f, getFirstCollision as g, findOrGenerateResponsiveLayout as h, sortBreakpoints as i, getIndentationValue as j, sortLayoutItems as s };
