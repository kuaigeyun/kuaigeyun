export declare enum Formatter {
    STRIKETHROUGH = "strikethrough",
    UNDERLINE = "underline",
    ALIGNMENT = "alignment",
    VERTICAL_ALIGNMENT = "verticalAlignment"
}
interface GroupButtonBoolean {
    key: Formatter;
    icon: string;
    type: 'boolean';
}
interface GroupButtonString {
    key: Formatter;
    icon: string;
    type: 'select';
    value: string;
}
type GroupButton = GroupButtonBoolean | GroupButtonString;
export declare function getExtraFormatterSchema(i18n: (key: string) => string): {
    title: string;
    widget: string;
    buttons: GroupButton[];
    span: number;
};
export {};
