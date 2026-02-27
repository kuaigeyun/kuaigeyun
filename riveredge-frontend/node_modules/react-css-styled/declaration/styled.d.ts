import { ForwardRefExoticComponent, PropsWithoutRef } from "react";
import { StyledElement } from "./StyledElement";
export default function defaultStyled<T extends HTMLElement | SVGElement = HTMLElement>(tag: string, css: string): typeof StyledElement & (new (...args: any[]) => StyledElement<T>);
export declare function styled<Target extends HTMLElement | SVGElement = HTMLElement, Props extends Record<string, any> = Record<string, any>>(Tag: string, css: string): ForwardRefExoticComponent<PropsWithoutRef<Props> & React.RefAttributes<Target>>;
