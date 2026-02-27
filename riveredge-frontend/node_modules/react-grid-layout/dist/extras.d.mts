import * as React from 'react';
import { d as GridCellConfig } from './calculate-FbCWy8x1.mjs';
import { c as Compactor } from './types-BiXsdXr7.mjs';

/**
 * GridBackground component
 *
 * Renders an SVG grid background that aligns with GridLayout cells.
 * Use this to visualize the grid structure behind your layout.
 */

interface GridBackgroundProps extends GridCellConfig {
    /**
     * Number of rows to display. If "auto", calculates based on height.
     * @default 10
     */
    rows?: number | "auto";
    /**
     * Height of the background in pixels. Used when rows="auto".
     */
    height?: number;
    /**
     * Color of the grid cell backgrounds.
     * @default "#e0e0e0"
     */
    color?: string;
    /**
     * Border radius of grid cells in pixels.
     * @default 4
     */
    borderRadius?: number;
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
     * Additional inline styles.
     */
    style?: React.CSSProperties;
}
/**
 * SVG grid background component.
 *
 * Renders a visual grid that aligns with GridLayout cells. Position this
 * behind your GridLayout using CSS positioning.
 *
 * @example
 * ```tsx
 * import { GridBackground } from 'react-grid-layout/extras';
 *
 * function MyGrid() {
 *   const { width, containerRef, mounted } = useContainerWidth();
 *
 *   return (
 *     <div ref={containerRef} style={{ position: 'relative' }}>
 *       {mounted && (
 *         <>
 *           <GridBackground
 *             width={width}
 *             cols={12}
 *             rowHeight={30}
 *             margin={[10, 10]}
 *             rows={10}
 *             color="#f0f0f0"
 *           />
 *           <GridLayout width={width} gridConfig={{ cols: 12, rowHeight: 30 }}>
 *             {children}
 *           </GridLayout>
 *         </>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
declare function GridBackground({ width, cols, rowHeight, margin, containerPadding, rows, height, color, borderRadius, className, style }: GridBackgroundProps): React.ReactElement;

/**
 * Fast Vertical Compactor
 *
 * An optimized vertical compaction algorithm using a "rising tide" approach.
 * This algorithm has O(n log n) complexity (dominated by sorting) compared to
 * the default vertical compactor which can have O(n²) complexity due to
 * recursive collision resolution.
 *
 * Best suited for large layouts (200+ items) where compaction performance
 * is critical. For smaller layouts, the difference is negligible.
 *
 * Based on the algorithm from PR #2152 by Morris Brodersen (@morris).
 *
 * @example
 * ```tsx
 * import { fastVerticalCompactor } from 'react-grid-layout/extras';
 *
 * <GridLayout
 *   compactor={fastVerticalCompactor}
 *   layout={layout}
 *   // ...
 * />
 * ```
 */

/**
 * Fast vertical compactor - optimized for large layouts.
 *
 * Uses a "rising tide" algorithm that achieves O(n log n) complexity
 * instead of the potentially O(n²) recursive collision resolution.
 *
 * Best suited for layouts with 200+ items where compaction performance
 * becomes noticeable. For smaller layouts, the standard verticalCompactor
 * works equally well.
 */
declare const fastVerticalCompactor: Compactor;
/**
 * Fast vertical compactor that allows overlapping items.
 *
 * Compacts items upward but allows them to overlap each other.
 */
declare const fastVerticalOverlapCompactor: Compactor;

/**
 * Fast Horizontal Compactor
 *
 * An optimized horizontal compaction algorithm using a "sweeping tide" approach.
 * This algorithm has O(n log n) complexity (dominated by sorting) compared to
 * the default horizontal compactor which can have O(n²) complexity due to
 * recursive collision resolution.
 *
 * Best suited for large layouts (200+ items) where compaction performance
 * is critical. For smaller layouts, the difference is negligible.
 *
 * Adapted from the vertical fast compactor algorithm from PR #2152 by Morris Brodersen (@morris).
 *
 * @example
 * ```tsx
 * import { fastHorizontalCompactor } from 'react-grid-layout/extras';
 *
 * <GridLayout
 *   compactor={fastHorizontalCompactor}
 *   layout={layout}
 *   // ...
 * />
 * ```
 */

/**
 * Fast horizontal compactor - optimized for large layouts.
 *
 * Uses a "sweeping tide" algorithm that achieves O(n log n) complexity
 * instead of the potentially O(n²) recursive collision resolution.
 *
 * Best suited for layouts with 200+ items where compaction performance
 * becomes noticeable. For smaller layouts, the standard horizontalCompactor
 * works equally well.
 */
declare const fastHorizontalCompactor: Compactor;
/**
 * Fast horizontal compactor that allows overlapping items.
 *
 * Compacts items leftward but allows them to overlap each other.
 */
declare const fastHorizontalOverlapCompactor: Compactor;

/**
 * Wrap Compactor
 *
 * A compaction algorithm that treats grid items like words in a paragraph.
 * Items flow left-to-right, wrapping to the next row when they reach
 * the grid edge.
 *
 * When dragging:
 * - Moving an item earlier in the sequence shifts other items down/right
 * - Moving an item later in the sequence shifts other items up/left
 *
 * This creates a natural reordering behavior similar to drag-and-drop
 * in file managers or card layouts.
 *
 * Based on the algorithm from PR #1773 by John Thomson (@JohnThomson).
 *
 * @example
 * ```tsx
 * import { wrapCompactor } from 'react-grid-layout/extras';
 *
 * <GridLayout
 *   compactor={wrapCompactor}
 *   layout={layout}
 *   // ...
 * />
 * ```
 */

/**
 * Wrap compactor - arranges items like words in a paragraph.
 *
 * Items flow left-to-right and wrap to the next row when they
 * reach the grid edge. Dragging an item reorders the sequence,
 * with other items shifting to maintain the flow.
 *
 * Works best with uniformly-sized items (especially 1x1), but
 * handles larger items by ensuring they fit within row bounds.
 */
declare const wrapCompactor: Compactor;
/**
 * Wrap compactor that allows overlapping items.
 */
declare const wrapOverlapCompactor: Compactor;

export { GridBackground, type GridBackgroundProps, fastHorizontalCompactor, fastHorizontalOverlapCompactor, fastVerticalCompactor, fastVerticalOverlapCompactor, wrapCompactor, wrapOverlapCompactor };
