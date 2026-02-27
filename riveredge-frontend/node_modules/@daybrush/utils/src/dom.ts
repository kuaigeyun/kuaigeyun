import { document } from "./consts";
import { IObject, IEventMap } from "./types";
import { isObject } from "./utils";

/**
 * @namespace DOM
 */

export function $<K extends keyof HTMLElementTagNameMap>(selectors: K, multi: true):
  NodeListOf<HTMLElementTagNameMap[K]>;
export function $<K extends keyof SVGElementTagNameMap>(selectors: K, multi: true): NodeListOf<SVGElementTagNameMap[K]>;
export function $<E extends Element = Element>(selectors: string, multi: true): NodeListOf<E>;

export function $<K extends keyof HTMLElementTagNameMap>(selectors: K, multi?: false): HTMLElementTagNameMap[K] | null;
export function $<K extends keyof SVGElementTagNameMap>(selectors: K, multi?: false): SVGElementTagNameMap[K] | null;
export function $<E extends Element = Element>(selectors: string, multi?: false): E | null;
/**
 * Returns all element descendants of node that
 * match selectors.
 */

/**
 * Checks if the specified class value exists in the element's class attribute.
 * @memberof DOM
 * @param - A DOMString containing one or more selectors to match
 * @param - If multi is true, a DOMString containing one or more selectors to match against.
 * @example
import {$} from "@daybrush/utils";

console.log($("div")); // div element
console.log($("div", true)); // [div, div] elements
*/
export function $<E extends Element = Element>(selectors: string, multi?: boolean): E | NodeListOf<E> | null {
  if (!document) {
    return multi ? [] as any : null;
  }
  return multi ? document.querySelectorAll<E>(selectors) : document.querySelector<E>(selectors);
}

/**
* Checks if the specified class value exists in the element's class attribute.
* @memberof DOM
* @param element - target
* @param className - the class name to search
* @return {boolean} return false if the class is not found.
* @example
import {hasClass} from "@daybrush/utils";

console.log(hasClass(element, "start")); // true or false
*/
export function hasClass(element: Element, className: string) {
  if (element.classList) {
    return element.classList.contains(className);
  }
  return !!element.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
}

/**
* Add the specified class value. If these classe already exist in the element's class attribute they are ignored.
* @memberof DOM
* @param element - target
* @param className - the class name to add
* @example
import {addClass} from "@daybrush/utils";

addClass(element, "start");
*/
export function addClass(element: Element, className: string) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ` ${className}`;
  }
}

/**
* Removes the specified class value.
* @memberof DOM
* @param element - target
* @param className - the class name to remove
* @example
import {removeClass} from "@daybrush/utils";

removeClass(element, "start");
*/
export function removeClass(element: Element, className: string) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);

    element.className = element.className.replace(reg, " ");
  }
}

/**
* Gets the CSS properties from the element.
* @memberof DOM
* @param elements - elements
* @param properites - the CSS properties
* @return returns CSS properties and values.
* @example
import {fromCSS} from "@daybrush/utils";

console.log(fromCSS(element, ["left", "opacity", "top"])); // {"left": "10px", "opacity": 1, "top": "10px"}
*/
export function fromCSS(
  elements: Element | Element[] | NodeListOf<Element>, properties: string[]): IObject<any> {
  if (!elements || !properties || !properties.length) {
    return {};
  }
  let element;

  if (elements instanceof Element) {
    element = elements;
  } else if (elements.length) {
    element = elements[0];
  } else {
    return {};
  }
  const cssObject: IObject<any> = {};
  const styles = getWindow(element).getComputedStyle(element) as any;
  const length = properties.length;

  for (let i = 0; i < length; ++i) {
    cssObject[properties[i]] = styles[properties[i]];
  }
  return cssObject;
}

export function addEvent<K extends keyof IEventMap>(
  el: EventTarget, type: K, listener: (e: IEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
/**
* Sets up a function that will be called whenever the specified event is delivered to the target
* @memberof DOM
* @param - event target
* @param - A case-sensitive string representing the event type to listen for.
* @param - The object which receives a notification (an object that implements the Event interface) when an event of the specified type occurs
* @param - An options object that specifies characteristics about the event listener.
* @example
import {addEvent} from "@daybrush/utils";

addEvent(el, "click", e => {
  console.log(e);
});
*/
export function addEvent(
  el: EventTarget,
  type: string, listener: (e: Event) => void,
  options?: boolean | AddEventListenerOptions) {
  el.addEventListener(type, listener, options);
}

export function removeEvent<K extends keyof IEventMap>(
  el: EventTarget, type: K, listener: (e: IEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
/**
* removes from the EventTarget an event listener previously registered with EventTarget.addEventListener()
* @memberof DOM
* @param - event target
* @param - A case-sensitive string representing the event type to listen for.
* @param - The EventListener function of the event handler to remove from the event target.
* @param - An options object that specifies characteristics about the event listener.
* @example
import {addEvent, removeEvent} from "@daybrush/utils";
const listener = e => {
  console.log(e);
};
addEvent(el, "click", listener);
removeEvent(el, "click", listener);
*/
export function removeEvent(
  el: EventTarget, type: string,
  listener: (e: Event) => void,
  options?: boolean | EventListenerOptions,
) {
  el.removeEventListener(type, listener, options);
}


export function getDocument(el?: Node) {
  return el?.ownerDocument || document;
}

export function getDocumentElement(el?: Node) {
  return getDocument(el).documentElement;
}

export function getDocumentBody(el?: Node) {
  return getDocument(el).body;
}

export function getWindow(el?: Node) {
  return el?.ownerDocument?.defaultView || window;
}


export function isWindow(val: any): val is Window {
  return val && "postMessage" in val && "blur" in val && "self" in val;
}

export function isNode(el?: any): el is Node {
  return isObject(el) && el.nodeName && el.nodeType && "ownerDocument" in el;
}
