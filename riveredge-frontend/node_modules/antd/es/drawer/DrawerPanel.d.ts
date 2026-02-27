import * as React from 'react';
import type { DrawerProps as RCDrawerProps } from '@rc-component/drawer';
import type { DrawerProps } from '.';
import type { ClosableType, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
export type SemanticName = 'root' | 'mask' | 'header' | 'title' | 'extra' | 'section' | 'body' | 'footer' | 'wrapper' | 'dragger' | 'close';
export type DrawerClassNamesType = SemanticClassNamesType<DrawerProps, SemanticName>;
export type DrawerStylesType = SemanticStylesType<DrawerProps, SemanticName>;
export interface DrawerPanelProps {
    prefixCls: string;
    ariaId?: string;
    title?: React.ReactNode;
    footer?: React.ReactNode;
    extra?: React.ReactNode;
    size?: DrawerProps['size'];
    /**
     * Recommend to use closeIcon instead
     *
     * e.g.
     *
     * `<Drawer closeIcon={false} />`
     */
    closable?: boolean | (Extract<ClosableType, object> & {
        placement?: 'start' | 'end';
    });
    closeIcon?: React.ReactNode;
    onClose?: RCDrawerProps['onClose'];
    children?: React.ReactNode;
    classNames?: DrawerClassNamesType;
    styles?: DrawerStylesType;
    loading?: boolean;
    /** @deprecated Please use `styles.header` instead */
    headerStyle?: React.CSSProperties;
    /** @deprecated Please use `styles.body` instead */
    bodyStyle?: React.CSSProperties;
    /** @deprecated Please use `styles.footer` instead */
    footerStyle?: React.CSSProperties;
    /** @deprecated Please use `styles.wrapper` instead */
    contentWrapperStyle?: React.CSSProperties;
    /** @deprecated Please use `styles.mask` instead */
    maskStyle?: React.CSSProperties;
    /** @deprecated Please use `styles.content` instead */
    drawerStyle?: React.CSSProperties;
}
declare const DrawerPanel: React.FC<DrawerPanelProps>;
export default DrawerPanel;
