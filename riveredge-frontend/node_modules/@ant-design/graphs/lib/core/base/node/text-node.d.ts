import React, { FC } from 'react';
export interface TextNodeProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
    /**
     * Node type
     * @default 'normal'
     */
    type?: 'normal' | 'filled' | 'outlined' | 'underlined';
    /**
     * Node text
     */
    text?: string;
    /**
     * Node color
     * @default '#1783ff'
     */
    color?: string;
    /**
     * Node max width. If the text width is greater than the max width, the text will be wrapped.
     * @default Infinity
     */
    maxWidth?: number;
    /**
     * Node border width
     * @default 2
     */
    borderWidth?: number;
    /**
     * Node font style (fontWeight, fontSize, fontFamily, fontStyle, fontVariant)
     */
    font?: {
        fontFamily?: string | undefined;
        fontSize?: number | string | undefined;
        fontStyle?: number | string | undefined;
        fontVariant?: number | string | undefined;
        fontWeight?: number | string | undefined;
    };
    /**
     * Whether the node is active
     * @default false
     */
    isActive?: boolean;
    /**
     * Whether the node is selected
     * @default false
     */
    isSelected?: boolean;
}
export declare const TextNode: FC<TextNodeProps>;
