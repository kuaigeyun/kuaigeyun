import React from 'react';
import { DraggableSyntheticListeners } from '@dnd-kit/core';
interface Props {
    /** Content to display in the item */
    value: React.ReactNode;
    /** Optional icon to display */
    icon?: React.ReactNode;
    /** Custom styles for the item */
    style?: React.CSSProperties;
    /** Status indicator for the item */
    status?: 'is-warning' | 'is-danger';
    /** Title attribute for the item */
    title?: string;
    /** Whether the item is required */
    required?: boolean;
    /** Whether the item is read-only */
    readOnly?: boolean;
    /** Whether the item is being dragged as an overlay */
    dragOverlay?: boolean;
    /** Click handler for the item */
    onClick?: () => void;
    /** Mouse enter handler */
    onMouseEnter?: () => void;
    /** Mouse leave handler */
    onMouseLeave?: () => void;
    /** Whether the item is currently being dragged */
    dragging?: boolean;
    /** Whether items are being sorted */
    sorting?: boolean;
    /** CSS transition value */
    transition?: string;
    /** Transform data for the item */
    transform?: {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
    } | null;
    /** Whether to fade the item in */
    fadeIn?: boolean;
    /** Drag listeners from dnd-kit */
    listeners?: DraggableSyntheticListeners;
}
declare const Item: React.MemoExoticComponent<React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLLIElement>>>;
export default Item;
