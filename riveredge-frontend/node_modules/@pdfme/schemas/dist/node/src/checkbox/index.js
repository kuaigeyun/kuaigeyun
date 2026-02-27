"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svg_js_1 = __importDefault(require("../graphics/svg.js"));
const utils_js_1 = require("../utils.js");
const constants_js_1 = require("../constants.js");
const lucide_1 = require("lucide");
const utils_js_2 = require("../utils.js");
const defaultStroke = 'currentColor';
const getCheckedIcon = (stroke = defaultStroke) => (0, utils_js_2.createSvgStr)(lucide_1.SquareCheck, { stroke });
const getUncheckedIcon = (stroke = defaultStroke) => (0, utils_js_2.createSvgStr)(lucide_1.Square, { stroke });
const getIcon = ({ value, color }) => value === 'true' ? getCheckedIcon(color) : getUncheckedIcon(color);
const schema = {
    ui: (arg) => {
        const { schema, value, onChange, rootElement, mode } = arg;
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        if ((0, utils_js_1.isEditable)(mode, schema)) {
            container.addEventListener('click', () => {
                if (onChange)
                    onChange({ key: 'content', value: value === 'true' ? 'false' : 'true' });
            });
        }
        void svg_js_1.default.ui({
            ...arg,
            rootElement: container,
            mode: 'viewer',
            value: getIcon({ value, color: schema.color }),
        });
        rootElement.appendChild(container);
    },
    pdf: (arg) => svg_js_1.default.pdf(Object.assign(arg, { value: getIcon({ value: arg.value, color: arg.schema.color }) })),
    propPanel: {
        schema: ({ i18n }) => ({
            color: {
                title: i18n('schemas.color'),
                type: 'string',
                widget: 'color',
                props: {
                    disabledAlpha: true,
                },
                required: true,
                rules: [{ pattern: constants_js_1.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
            },
        }),
        defaultSchema: {
            name: '',
            type: 'checkbox',
            content: 'false',
            position: { x: 0, y: 0 },
            width: 8,
            height: 8,
            color: '#000000',
        },
    },
    icon: getCheckedIcon(),
};
exports.default = schema;
//# sourceMappingURL=index.js.map