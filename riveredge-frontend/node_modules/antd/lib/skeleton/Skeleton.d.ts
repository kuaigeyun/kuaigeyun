import * as React from 'react';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { AvatarProps } from './Avatar';
import SkeletonAvatar from './Avatar';
import SkeletonButton from './Button';
import SkeletonImage from './Image';
import SkeletonInput from './Input';
import SkeletonNode from './Node';
import type { SkeletonParagraphProps } from './Paragraph';
import type { SkeletonTitleProps } from './Title';
type SkeletonAvatarProps = Omit<AvatarProps, 'active'>;
export type SemanticName = 'root' | 'header' | 'section' | 'avatar' | 'title' | 'paragraph';
export type SkeletonClassNamesType = SemanticClassNamesType<SkeletonProps, SemanticName>;
export type SkeletonStylesType = SemanticStylesType<SkeletonProps, SemanticName>;
export interface SkeletonProps {
    active?: boolean;
    loading?: boolean;
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    avatar?: SkeletonAvatarProps | boolean;
    title?: SkeletonTitleProps | boolean;
    paragraph?: SkeletonParagraphProps | boolean;
    round?: boolean;
    classNames?: SkeletonClassNamesType;
    styles?: SkeletonStylesType;
}
type CompoundedComponent = {
    Button: typeof SkeletonButton;
    Avatar: typeof SkeletonAvatar;
    Input: typeof SkeletonInput;
    Image: typeof SkeletonImage;
    Node: typeof SkeletonNode;
};
declare const Skeleton: React.FC<React.PropsWithChildren<SkeletonProps>> & CompoundedComponent;
export default Skeleton;
