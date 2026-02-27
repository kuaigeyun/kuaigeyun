import cssStyled from "css-styled";
import {
    createElement, forwardRef,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";
import { StyledElement } from "./StyledElement";

export default function defaultStyled<T extends HTMLElement | SVGElement = HTMLElement>(
    tag: string, css: string): typeof StyledElement & (new (...args: any[]) => StyledElement<T>) {
    const injector = cssStyled(css);

    return class Styled extends StyledElement<T> {
        public injector = injector;
        public tag = tag;
    };
}


export function styled<
    Target extends HTMLElement | SVGElement = HTMLElement,
    Props extends Record<string, any> = Record<string, any>,
>(
    Tag: string,
    css: string
): ForwardRefExoticComponent<PropsWithoutRef<Props> & React.RefAttributes<Target>> {
    const injector = cssStyled(css);
    const cssId = injector!.className;

    return forwardRef<Target, Props>((props, ref) => {
        const {
            className = "",
            cspNonce,
            ...attributes
        } = props;
        const targetRef = useRef<Target>();

        useImperativeHandle(ref, () => targetRef.current!, []);
        useEffect(() => {
            const injectResult = injector.inject(targetRef.current!, {
                nonce: props.cspNonce,
            });

            return () => {
                injectResult.destroy();
            };
        }, []);
        return createElement(Tag, {
            "ref": targetRef,
            "data-styled-id": cssId,
            "className": `${className} ${cssId}`,
            ...attributes,
        });
    });
}
