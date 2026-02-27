import { HoverActivate } from '@antv/g6';
/**
 * Behavior to activate the hovered element and its chain (including nodes and edges).
 */
export declare class HoverActivateChain extends HoverActivate {
    protected getActiveIds(event: any): any[];
    private collectChainNodes;
}
