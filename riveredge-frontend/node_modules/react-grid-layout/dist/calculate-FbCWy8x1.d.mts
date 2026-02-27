import { P as Position, d as ResizeHandleAxis } from './types-BiXsdXr7.mjs';

/**
 * Grid calculation utilities.
 *
 * These functions convert between grid units and pixel positions.
 */

/**
 * Parameters needed for position calculations.
 */
interface PositionParams {
    readonly margin: readonly [number, number];
    readonly containerPadding: readonly [number, number];
    readonly containerWidth: number;
    readonly cols: number;
    readonly rowHeight: number;
    readonly maxRows: number;
}
/**
 * Calculate the width of a single grid column in pixels.
 *
 * @param positionParams - Grid parameters
 * @returns Column width in pixels
 */
declare function calcGridColWidth(positionParams: PositionParams): number;
/**
 * Calculate the pixel size for a grid unit dimension (width or height).
 *
 * Can be called as:
 * - calcGridItemWHPx(w, colWidth, margin[0]) for width
 * - calcGridItemWHPx(h, rowHeight, margin[1]) for height
 *
 * @param gridUnits - Size in grid units
 * @param colOrRowSize - Column width or row height in pixels
 * @param marginPx - Margin between items in pixels
 * @returns Size in pixels
 */
declare function calcGridItemWHPx(gridUnits: number, colOrRowSize: number, marginPx: number): number;
/**
 * Calculate pixel position for a grid item.
 *
 * Returns left, top, width, height in pixels.
 *
 * @param positionParams - Grid parameters
 * @param x - X coordinate in grid units
 * @param y - Y coordinate in grid units
 * @param w - Width in grid units
 * @param h - Height in grid units
 * @param dragPosition - If present, use exact left/top from drag callbacks
 * @param resizePosition - If present, use exact dimensions from resize callbacks
 * @returns Position in pixels
 */
declare function calcGridItemPosition(positionParams: PositionParams, x: number, y: number, w: number, h: number, dragPosition?: {
    top: number;
    left: number;
} | null, resizePosition?: {
    top: number;
    left: number;
    height: number;
    width: number;
} | null): Position;
/**
 * Translate pixel coordinates to grid units.
 *
 * @param positionParams - Grid parameters
 * @param top - Top position in pixels (relative to parent)
 * @param left - Left position in pixels (relative to parent)
 * @param w - Width in grid units (for clamping)
 * @param h - Height in grid units (for clamping)
 * @returns x and y in grid units
 */
declare function calcXY(positionParams: PositionParams, top: number, left: number, w: number, h: number): {
    x: number;
    y: number;
};
/**
 * Translate pixel coordinates to grid units without clamping.
 *
 * Use this with the constraint system for custom boundary control.
 *
 * @param positionParams - Grid parameters
 * @param top - Top position in pixels (relative to parent)
 * @param left - Left position in pixels (relative to parent)
 * @returns x and y in grid units (unclamped)
 */
declare function calcXYRaw(positionParams: PositionParams, top: number, left: number): {
    x: number;
    y: number;
};
/**
 * Calculate grid units from pixel dimensions.
 *
 * @param positionParams - Grid parameters
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @param x - X coordinate in grid units (for clamping)
 * @param y - Y coordinate in grid units (for clamping)
 * @param handle - Resize handle being used
 * @returns w, h in grid units
 */
declare function calcWH(positionParams: PositionParams, width: number, height: number, x: number, y: number, handle: ResizeHandleAxis): {
    w: number;
    h: number;
};
/**
 * Calculate grid units from pixel dimensions without clamping.
 *
 * Use this with the constraint system for custom size control.
 *
 * @param positionParams - Grid parameters
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @returns w, h in grid units (unclamped, minimum 1)
 */
declare function calcWHRaw(positionParams: PositionParams, width: number, height: number): {
    w: number;
    h: number;
};
/**
 * Clamp a number between bounds.
 *
 * @param num - Number to clamp
 * @param lowerBound - Minimum value
 * @param upperBound - Maximum value
 * @returns Clamped value
 */
declare function clamp(num: number, lowerBound: number, upperBound: number): number;
/**
 * Grid cell dimension information for rendering backgrounds or overlays.
 */
interface GridCellDimensions {
    /** Width of a single cell in pixels */
    readonly cellWidth: number;
    /** Height of a single cell in pixels */
    readonly cellHeight: number;
    /** Horizontal offset from container edge to first cell */
    readonly offsetX: number;
    /** Vertical offset from container edge to first cell */
    readonly offsetY: number;
    /** Horizontal gap between cells */
    readonly gapX: number;
    /** Vertical gap between cells */
    readonly gapY: number;
    /** Number of columns */
    readonly cols: number;
    /** Total container width */
    readonly containerWidth: number;
}
/**
 * Configuration for grid cell dimension calculation.
 */
interface GridCellConfig {
    /** Container width in pixels */
    width: number;
    /** Number of columns */
    cols: number;
    /** Row height in pixels */
    rowHeight: number;
    /** Margin between items [x, y] */
    margin?: readonly [number, number];
    /** Container padding [x, y], defaults to margin if not specified */
    containerPadding?: readonly [number, number] | null;
}
/**
 * Calculate grid cell dimensions for rendering backgrounds or overlays.
 *
 * This function provides all the measurements needed to render a visual
 * grid background that aligns with the actual grid cells.
 *
 * @param config - Grid configuration
 * @returns Cell dimensions and offsets
 *
 * @example
 * ```tsx
 * import { calcGridCellDimensions } from 'react-grid-layout/core';
 *
 * const dims = calcGridCellDimensions({
 *   width: 1200,
 *   cols: 12,
 *   rowHeight: 30,
 *   margin: [10, 10],
 *   containerPadding: [10, 10]
 * });
 *
 * // dims.cellWidth = 88.33...
 * // dims.cellHeight = 30
 * // dims.offsetX = 10 (containerPadding[0])
 * // dims.offsetY = 10 (containerPadding[1])
 * // dims.gapX = 10 (margin[0])
 * // dims.gapY = 10 (margin[1])
 * ```
 */
declare function calcGridCellDimensions(config: GridCellConfig): GridCellDimensions;

export { type GridCellDimensions as G, type PositionParams as P, calcXY as a, calcWH as b, calcGridItemPosition as c, type GridCellConfig as d, calcGridColWidth as e, calcGridItemWHPx as f, calcXYRaw as g, calcWHRaw as h, clamp as i, calcGridCellDimensions as j };
