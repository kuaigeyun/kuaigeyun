import { getHash, injectStyle, getShadowRoot } from "./utils";
import { StyledInjector, InjectOptions } from "./types";

/**
 * Create an styled object that can be defined and inserted into the css.
 * @param - css styles
 */
function styled(css: string): StyledInjector {
    const injectClassName = "rCS" + getHash(css);

    return {
        className: injectClassName,
        inject(el: HTMLElement | SVGElement, options: Partial<InjectOptions> = {}) {
            const shadowRoot = getShadowRoot(el);
            let styleElement = (shadowRoot || el.ownerDocument || document).querySelector<HTMLStyleElement>(`style[data-styled-id="${injectClassName}"]`);

            if (!styleElement) {
                styleElement = injectStyle(injectClassName, css, options, el, shadowRoot);
            } else {
                const count = parseFloat(styleElement.getAttribute("data-styled-count")) || 0;
                styleElement.setAttribute("data-styled-count", `${count + 1}`);
            }
            return {
                destroy() {
                    const injectCount = parseFloat(styleElement.getAttribute("data-styled-count")) || 0;

                    if (injectCount <= 1) {
                        if (styleElement.remove) {
                            styleElement.remove();
                        } else {
                            styleElement.parentNode?.removeChild(styleElement);
                        }
                        styleElement = null;
                    } else {
                        styleElement.setAttribute("data-styled-count", `${injectCount - 1}`);
                    }
                },
            };
        },
    };
}

export * from "./types";
export default styled;
