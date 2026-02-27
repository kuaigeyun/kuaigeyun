import React from 'react';
export interface OrganizationChartNodeProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
    /**
     * Name of the person
     */
    name: string;
    /**
     * Position of the person
     */
    position: string;
    /**
     * Working status of the person
     */
    status?: string;
    /**
     * Whether the node is hovered
     */
    isActive?: boolean;
}
export declare const OrganizationChartNode: React.FC<OrganizationChartNodeProps>;
