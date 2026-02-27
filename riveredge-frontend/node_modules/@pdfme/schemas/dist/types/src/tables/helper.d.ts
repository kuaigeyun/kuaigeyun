export declare const getDefaultCellStyles: () => {
    fontName: undefined;
    alignment: import("../text/types.js").ALIGNMENT;
    verticalAlignment: import("../text/types.js").VERTICAL_ALIGNMENT;
    fontSize: number;
    lineHeight: number;
    characterSpacing: number;
    fontColor: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    padding: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
};
export declare const getCellPropPanelSchema: (arg: {
    i18n: (key: string) => string;
    fallbackFontName: string;
    fontNames: string[];
    isBody?: boolean;
}) => {
    '-': {
        type: string;
        widget: string;
    };
    borderWidth: {
        title: string;
        type: string;
        widget: string;
        span: number;
        properties: {
            top: {
                type: string;
                widget: string;
                props: {
                    min: number;
                    step: number;
                };
                span: number;
                title: string;
            };
            right: {
                type: string;
                widget: string;
                props: {
                    min: number;
                    step: number;
                };
                span: number;
                title: string;
            };
            bottom: {
                type: string;
                widget: string;
                props: {
                    min: number;
                    step: number;
                };
                span: number;
                title: string;
            };
            left: {
                type: string;
                widget: string;
                props: {
                    min: number;
                    step: number;
                };
                span: number;
                title: string;
            };
        };
    };
    '--': {
        type: string;
        widget: string;
    };
    padding: {
        title: string;
        type: string;
        widget: string;
        span: number;
        properties: {
            top: {
                type: string;
                widget: string;
                props: {
                    min: number;
                    step: number;
                };
                span: number;
                title: string;
            };
            right: {
                type: string;
                widget: string;
                props: {
                    min: number;
                    step: number;
                };
                span: number;
                title: string;
            };
            bottom: {
                type: string;
                widget: string;
                props: {
                    min: number;
                    step: number;
                };
                span: number;
                title: string;
            };
            left: {
                type: string;
                widget: string;
                props: {
                    min: number;
                    step: number;
                };
                span: number;
                title: string;
            };
        };
    };
    alternateBackgroundColor?: {
        title: string;
        type: string;
        widget: string;
        props: {
            disabledAlpha: boolean;
        };
        rules: {
            pattern: string;
            message: string;
        }[];
    } | undefined;
    fontName: {
        title: string;
        type: string;
        widget: string;
        default: string;
        placeholder: string;
        props: {
            options: {
                label: string;
                value: string;
            }[];
        };
        span: number;
    };
    fontSize: {
        title: string;
        type: string;
        widget: string;
        props: {
            min: number;
        };
        span: number;
    };
    characterSpacing: {
        title: string;
        type: string;
        widget: string;
        props: {
            min: number;
        };
        span: number;
    };
    alignment: {
        title: string;
        type: string;
        widget: string;
        props: {
            options: {
                label: string;
                value: import("../text/types.js").ALIGNMENT;
            }[];
        };
        span: number;
    };
    verticalAlignment: {
        title: string;
        type: string;
        widget: string;
        props: {
            options: {
                label: string;
                value: import("../text/types.js").VERTICAL_ALIGNMENT;
            }[];
        };
        span: number;
    };
    lineHeight: {
        title: string;
        type: string;
        widget: string;
        props: {
            step: number;
            min: number;
        };
        span: number;
    };
    fontColor: {
        title: string;
        type: string;
        widget: string;
        props: {
            disabledAlpha: boolean;
        };
        rules: {
            pattern: string;
            message: string;
        }[];
    };
    borderColor: {
        title: string;
        type: string;
        widget: string;
        props: {
            disabledAlpha: boolean;
        };
        rules: {
            pattern: string;
            message: string;
        }[];
    };
    backgroundColor: {
        title: string;
        type: string;
        widget: string;
        props: {
            disabledAlpha: boolean;
        };
        rules: {
            pattern: string;
            message: string;
        }[];
    };
};
export declare const getColumnStylesPropPanelSchema: ({ head, i18n, }: {
    head: string[];
    i18n: (key: string) => string;
}) => {
    alignment: {
        type: string;
        widget: string;
        title: string;
        column: number;
        properties: {};
    };
};
export declare const getBody: (value: string | string[][]) => string[][];
export declare const getBodyWithRange: (value: string | string[][], range?: {
    start: number;
    end?: number | undefined;
}) => string[][];
