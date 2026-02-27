import { Component, createElement, version } from "react";
import { IObject } from "@daybrush/utils";
import { StyledInjector, InjectResult } from "css-styled";
import { ref } from "framework-utils";

export class StyledElement<T extends HTMLElement | SVGElement = HTMLElement> extends Component<IObject<any>> {
    public injector!: StyledInjector;
    public element!: T;
    public injectResult: InjectResult | null = null;
    public tag: string = "div";
    public render(): any {
        const {
            className = "",
            cspNonce,
            portalContainer,
            ...attributes
        } = this.props;
        const cssId = this.injector!.className;
        const Tag = this.tag;
        let portalAttributes: Record<string, any> = {};

        if ((version || "").indexOf("simple") > -1 && portalContainer) {
            portalAttributes = { portalContainer };
        }

        return createElement(Tag, {
            "ref": ref(this, "element"),
            "data-styled-id": cssId,
            "className": `${className} ${cssId}`,
            ...portalAttributes,
            ...attributes,
        });
    }
    public componentDidMount() {
        this.injectResult = this.injector!.inject(this.element!, {
            nonce: this.props.cspNonce,
        });
    }
    public componentWillUnmount() {
        this.injectResult!.destroy();
        this.injectResult = null;
    }
    public getElement() {
        return this.element;
    }
}
