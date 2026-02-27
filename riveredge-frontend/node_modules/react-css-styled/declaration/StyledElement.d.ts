import { Component } from "react";
import { IObject } from "@daybrush/utils";
import { StyledInjector, InjectResult } from "css-styled";
export declare class StyledElement<T extends HTMLElement | SVGElement = HTMLElement> extends Component<IObject<any>> {
    injector: StyledInjector;
    element: T;
    injectResult: InjectResult | null;
    tag: string;
    render(): any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getElement(): T;
}
