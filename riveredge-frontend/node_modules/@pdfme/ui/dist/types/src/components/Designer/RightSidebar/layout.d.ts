import React from 'react';
export declare const SIDEBAR_H_PADDING_PX = 16;
export declare const SIDEBAR_V_PADDING_PX = 8;
export declare const SIDEBAR_HEADER_HEIGHT = 60;
type SectionProps = {
    children: React.ReactNode;
};
type SidebarFrameProps = SectionProps & {
    className?: string;
};
export declare const SidebarFrame: ({ children, className }: SidebarFrameProps) => React.JSX.Element;
export declare const SidebarHeader: ({ children }: SectionProps) => React.JSX.Element;
export declare const SidebarBody: ({ children }: SectionProps) => React.JSX.Element;
export declare const SidebarFooter: ({ children }: SectionProps) => React.JSX.Element;
export {};
