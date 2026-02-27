import stringHash from "string-hash";
import { getDocument, splitComma } from "@daybrush/utils";
import { InjectOptions } from "./types";

export function getHash(str: string) {
    return stringHash(str).toString(36);
}
export function getShadowRoot(parentElement: HTMLElement | SVGElement) {
    if (parentElement && parentElement.getRootNode) {
        const rootNode = parentElement.getRootNode();

        if (rootNode.nodeType === 11) {
            return rootNode as ShadowRoot;
        }
    }
    return;
}
export function replaceStyle(className: string, css: string, options: Partial<InjectOptions>) {
    if (options.original) {
        return css;
    }
    return css.replace(/([^};{\s}][^};{]*|^\s*){/mg, (_, selector) => {
        const trimmedSelector = selector.trim();
        return (trimmedSelector ? splitComma(trimmedSelector) : [""]).map(subSelector => {
            const trimmedSubSelector = subSelector.trim();
            if (trimmedSubSelector.indexOf("@") === 0) {
                return trimmedSubSelector;
            } else if (trimmedSubSelector.indexOf(":global") > -1) {
                return trimmedSubSelector.replace(/\:global/g, "");
            } else if (trimmedSubSelector.indexOf(":host") > -1) {
                return `${trimmedSubSelector.replace(/\:host/g, `.${className}`)}`;
            } else if (trimmedSubSelector) {
                return `.${className} ${trimmedSubSelector}`;
            } else {
                return `.${className}`;
            }
        }).join(", ") + " {";
    });
}
export function injectStyle(className: string, css: string, options: Partial<InjectOptions>, el: Node, shadowRoot?: Node) {
    const doc = getDocument(el);
    const style = doc.createElement("style");

    style.setAttribute("type", "text/css");
    style.setAttribute("data-styled-id", className);
    style.setAttribute("data-styled-count", "1");

    if (options.nonce) {
        style.setAttribute("nonce", options.nonce);
    }
    style.innerHTML = replaceStyle(className, css, options);

    (shadowRoot || doc.head || doc.body).appendChild(style);
    return style;
}
