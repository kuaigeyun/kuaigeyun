import * as React from 'react';
import type { SemanticClassNames, SemanticClassNamesType, SemanticStyles, SemanticStylesType } from '../_util/hooks';
import type { AffixProps } from '../affix';
import type { AnchorLinkBaseProps } from './AnchorLink';
export interface AnchorLinkItemProps extends AnchorLinkBaseProps {
    key: React.Key;
    children?: AnchorLinkItemProps[];
}
export type AnchorContainer = HTMLElement | Window;
type SemanticName = 'root' | 'item' | 'itemTitle' | 'indicator';
export type AnchorClassNamesType = SemanticClassNamesType<AnchorProps, SemanticName>;
export type AnchorStylesType = SemanticStylesType<AnchorProps, SemanticName>;
export interface AnchorProps {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    classNames?: AnchorClassNamesType;
    styles?: AnchorStylesType;
    /**
     * @deprecated Please use `items` instead.
     */
    children?: React.ReactNode;
    offsetTop?: number;
    bounds?: number;
    affix?: boolean | Omit<AffixProps, 'offsetTop' | 'target' | 'children'>;
    showInkInFixed?: boolean;
    getContainer?: () => AnchorContainer;
    /** Return customize highlight anchor */
    getCurrentAnchor?: (activeLink: string) => string;
    onClick?: (e: React.MouseEvent<HTMLElement>, link: {
        title: React.ReactNode;
        href: string;
    }) => void;
    /** Scroll to target offset value, if none, it's offsetTop prop value or 0. */
    targetOffset?: number;
    /** Listening event when scrolling change active link */
    onChange?: (currentActiveLink: string) => void;
    items?: AnchorLinkItemProps[];
    direction?: AnchorDirection;
    replace?: boolean;
}
export interface AnchorState {
    activeLink: null | string;
}
export interface AnchorDefaultProps extends AnchorProps {
    prefixCls: string;
    affix: boolean;
    showInkInFixed: boolean;
    getContainer: () => AnchorContainer;
}
export type AnchorDirection = 'vertical' | 'horizontal';
export interface AntAnchor {
    registerLink: (link: string) => void;
    unregisterLink: (link: string) => void;
    activeLink: string | null;
    scrollTo: (link: string) => void;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: {
        title: React.ReactNode;
        href: string;
    }) => void;
    direction: AnchorDirection;
    classNames?: SemanticClassNames<SemanticName>;
    styles?: SemanticStyles<SemanticName>;
}
declare const Anchor: React.FC<AnchorProps>;
export default Anchor;
