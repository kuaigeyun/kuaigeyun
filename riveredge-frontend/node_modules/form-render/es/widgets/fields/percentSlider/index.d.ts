import * as React from 'react';
interface Props {
    schema: {
        max?: number;
        min?: number;
        step?: number;
    };
    options?: {
        hideNumber?: boolean;
    };
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    readonly?: boolean;
}
declare const PercentSlider: React.FC<Props>;
export default PercentSlider;
