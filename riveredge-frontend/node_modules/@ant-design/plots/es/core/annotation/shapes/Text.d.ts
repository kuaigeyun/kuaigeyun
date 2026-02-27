import type { DisplayObjectConfig, TextStyleProps as GTextStyleProps } from '@antv/g';
import { Text as GText } from '@antv/g';
export declare class Text extends GText {
    constructor({ style, ...restOptions }?: DisplayObjectConfig<GTextStyleProps>);
}
