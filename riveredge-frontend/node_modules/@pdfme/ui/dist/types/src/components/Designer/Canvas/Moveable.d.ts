import React from 'react';
import MoveableComponent, { OnDrag, OnRotate, OnRotateEnd, OnClick, OnResize } from 'react-moveable';
type Props = {
    target: HTMLElement[];
    bounds: {
        left: number;
        top: number;
        bottom: number;
        right: number;
    };
    horizontalGuidelines: number[];
    verticalGuidelines: number[];
    keepRatio: boolean;
    rotatable: boolean;
    onDrag: ({ target, left, top }: OnDrag) => void;
    onDragEnd: ({ target }: {
        target: HTMLElement | SVGElement;
    }) => void;
    onDragGroupEnd: ({ targets }: {
        targets: (HTMLElement | SVGElement)[];
    }) => void;
    onRotate: ({ target, rotate }: OnRotate) => void;
    onRotateEnd: ({ target }: OnRotateEnd) => void;
    onRotateGroupEnd: ({ targets }: {
        targets: (HTMLElement | SVGElement)[];
    }) => void;
    onResize: ({ target, width, height, direction }: OnResize) => void;
    onResizeEnd: ({ target }: {
        target: HTMLElement | SVGElement;
    }) => void;
    onResizeGroupEnd: ({ targets }: {
        targets: (HTMLElement | SVGElement)[];
    }) => void;
    onClick: (e: OnClick) => void;
};
declare const _default: React.ForwardRefExoticComponent<Props & React.RefAttributes<MoveableComponent<{}>>>;
export default _default;
