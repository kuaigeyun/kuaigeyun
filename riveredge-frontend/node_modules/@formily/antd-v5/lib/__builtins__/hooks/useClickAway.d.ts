import { MutableRefObject } from 'react';
type EventType = MouseEvent | TouchEvent;
type BasicTarget<T = HTMLElement> = (() => T | null) | T | null | MutableRefObject<T | null | undefined>;
export declare const useClickAway: (onClickAway: (event: EventType) => void, target: BasicTarget | BasicTarget[], eventName?: string) => void;
export {};
