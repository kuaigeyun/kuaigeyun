/** new Chart options */
export declare const CHART_OPTIONS: string[];
/** There is only the view layer, no need to pass it down to children */
export declare const VIEW_OPTIONS: string[];
/** 特殊标识，用于标识改配置来自于转换逻辑，而非用户配置 */
export declare const TRANSFORM_SIGN = "__transform__";
/** 特殊标识，用于跳过 删除已转换的配置项 */
export declare const SKIP_DEL_CUSTOM_SIGN = "__skipDelCustomKeys__";
export declare const TRANSFORM_OPTION_KEY: {
    /** encode */
    xField: string;
    yField: string;
    colorField: string;
    angleField: string;
    keyField: string;
    y1Field: string;
    sizeField: string;
    setsField: string;
    shapeField: string;
    seriesField: string;
    positionField: string;
    textField: string;
    valueField: string;
    binField: string;
    srcField: string;
    linkColorField: string;
    fontSizeField: string;
    coordinateType: string;
    radius: string;
    innerRadius: string;
    startAngle: string;
    endAngle: string;
    focusX: string;
    focusY: string;
    distortionX: string;
    distortionY: string;
    visual: string;
    /**
     * @title 堆叠
     * @example
     *  1. stack: true -> transform: [{type: 'stackY'}]
     */
    stack: {
        target: string;
        value: (value: boolean | object) => {
            type: string;
            available: boolean | object;
        } | {
            type: string;
            available?: undefined;
        };
    };
    /**
     * @title 归一化
     * @example
     *  1. normalize: true -> transform: [{type: 'normalizeY'}]
     */
    normalize: {
        target: string;
        value: (value: boolean | object) => {
            type: string;
            available: boolean | object;
        } | {
            type: string;
            available?: undefined;
        };
    };
    /**
     * @title 百分比
     * @description 同 normalize
     * @example
     *  1. percent: true -> transform: [{type: 'normalizeY'}]
     */
    percent: {
        target: string;
        value: (value: boolean | object) => {
            type: string;
            available: boolean | object;
        } | {
            type: string;
            available?: undefined;
        };
    };
    /**
     * @title 分组
     * @example
     *  1. group: true -> transform: [{type: 'dodgeX'}]
     */
    group: {
        target: string;
        value: (value: boolean | object) => {
            type: string;
            available: boolean | object;
        } | {
            type: string;
            available?: undefined;
        };
    };
    /**
     * @title 排序
     * @example
     *  1. sort: true -> transform: [{type: 'sortX'}]
     */
    sort: {
        target: string;
        value: (value: boolean | object) => {
            type: string;
            available: boolean | object;
        } | {
            type: string;
            available?: undefined;
        };
    };
    /**
     * @title 对称
     * @example
     *  1. symmetry: true -> transform: [{type: 'symmetryY'}]
     */
    symmetry: {
        target: string;
        value: (value: boolean | object) => {
            type: string;
            available: boolean | object;
        } | {
            type: string;
            available?: undefined;
        };
    };
    /**
     * @title 对 y 和 y1 通道求差集
     * @example
     *  1. diff: true -> transform: [{type: 'diffY'}]
     */
    diff: {
        target: string;
        value: (value: boolean | object) => {
            type: string;
            available: boolean | object;
        } | {
            type: string;
            available?: undefined;
        };
    };
    meta: {
        target: string;
        value: (value: object) => object;
    };
    label: {
        target: string;
        value: (value: object) => object;
    };
    /**
     * @title 折线的形状
     * @example
     *  1. shape: 'smooth' -> style: {shape: 'smooth'}
     */
    shape: string;
    /**
     * @title 是否链接空值
     * @description 支持 boolean 和 对象类型
     */
    connectNulls: {
        target: string;
        value: (value: boolean | object) => boolean | object;
    };
    /**
     * @title 坐标转换
     * @example
     *  1. transpose: true -> coordinate: { transform: [{ type: 'transpose' }]}
     *  2. transpose: false -> coordinate: { }
     */
    transpose: {
        target: string;
        value: (value: boolean | object) => {
            type: string;
            available: boolean | object;
        } | {
            type: string;
            available?: undefined;
        };
    };
};
export declare const CONFIG_SHAPE: ({
    key: string;
    extendedProperties: any[];
    type?: undefined;
    defaultShapeConfig?: undefined;
} | {
    key: string;
    type: string;
    extendedProperties: string[];
    defaultShapeConfig?: undefined;
} | {
    key: string;
    type: string;
    extendedProperties: string[];
    defaultShapeConfig: {
        shapeField: string;
    };
})[];
/**
 * @description 一些特殊的配置项，需要自定义转换逻辑
 */
export declare const SPECIAL_OPTIONS: ({
    key: string;
    callback: (origin: object, key: string, value: {
        type: string;
        available?: boolean;
    }) => void;
} | {
    key: string;
    callback: (origin: object, key: string, value: {
        available?: boolean;
        text?: string | Function;
        [key: string]: unknown;
    } | any[]) => void;
})[];
export declare const ANNOTATION_LIST: {
    key: string;
    shape: string;
}[];
