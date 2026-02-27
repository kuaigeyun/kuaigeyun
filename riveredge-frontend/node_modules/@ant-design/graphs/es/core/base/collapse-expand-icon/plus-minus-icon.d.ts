import React, { FC } from 'react';
interface PlusMinusIconProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
    /**
     * Whether the node is collapsed
     */
    isCollapsed: boolean;
}
export declare const PlusMinusIcon: FC<PlusMinusIconProps>;
export {};
