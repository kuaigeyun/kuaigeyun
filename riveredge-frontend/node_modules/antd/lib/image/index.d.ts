import * as React from 'react';
import type { ImageProps as RcImageProps } from '@rc-component/image';
import type { MaskType, SemanticClassNames, SemanticClassNamesType, SemanticStyles, SemanticStylesType } from '../_util/hooks';
import PreviewGroup from './PreviewGroup';
type OriginPreviewConfig = NonNullable<Exclude<RcImageProps['preview'], boolean>>;
export type DeprecatedPreviewConfig = {
    /** @deprecated Use `open` instead */
    visible?: boolean;
    /** @deprecated Use `classNames.root` instead */
    rootClassName?: string;
    /**
     * @deprecated This has been removed.
     * Preview will always be rendered after show.
     */
    forceRender?: boolean;
    /**
     * @deprecated This has been removed.
     * Preview will always be rendered after show.
     */
    destroyOnClose?: boolean;
    /** @deprecated Use `actionsRender` instead */
    toolbarRender?: OriginPreviewConfig['actionsRender'];
};
export type PreviewConfig = OriginPreviewConfig & DeprecatedPreviewConfig & {
    /** @deprecated Use `onOpenChange` instead */
    onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
    /** @deprecated Use `classNames.cover` instead */
    maskClassName?: string;
    mask?: MaskType | React.ReactNode;
};
export interface CompositionImage<P> extends React.FC<P> {
    PreviewGroup: typeof PreviewGroup;
}
export type ImageSemanticName = 'root' | 'image' | 'cover';
export type PopupSemantic = 'root' | 'mask' | 'body' | 'footer' | 'actions';
export type ImageClassNamesType = SemanticClassNamesType<ImageProps, ImageSemanticName, {
    popup?: SemanticClassNames<PopupSemantic>;
}>;
export type ImageStylesType = SemanticStylesType<ImageProps, ImageSemanticName, {
    popup?: SemanticStyles<PopupSemantic>;
}>;
export interface ImageProps extends Omit<RcImageProps, 'preview' | 'classNames' | 'styles'> {
    preview?: boolean | PreviewConfig;
    /** @deprecated Use `styles.root` instead */
    wrapperStyle?: React.CSSProperties;
    classNames?: ImageClassNamesType;
    styles?: ImageStylesType;
}
declare const Image: CompositionImage<ImageProps>;
export type { PreviewConfig as ImagePreviewType };
export default Image;
