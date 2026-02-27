"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINE_END_FORBIDDEN_CHARS = exports.LINE_START_FORBIDDEN_CHARS = exports.FONT_SIZE_ADJUSTMENT = exports.DEFAULT_DYNAMIC_MAX_FONT_SIZE = exports.DEFAULT_DYNAMIC_MIN_FONT_SIZE = exports.DEFAULT_DYNAMIC_FIT = exports.DYNAMIC_FIT_HORIZONTAL = exports.DYNAMIC_FIT_VERTICAL = exports.PLACEHOLDER_FONT_COLOR = exports.DEFAULT_FONT_COLOR = exports.DEFAULT_CHARACTER_SPACING = exports.DEFAULT_LINE_HEIGHT = exports.DEFAULT_VERTICAL_ALIGNMENT = exports.VERTICAL_ALIGN_BOTTOM = exports.VERTICAL_ALIGN_MIDDLE = exports.VERTICAL_ALIGN_TOP = exports.DEFAULT_ALIGNMENT = exports.ALIGN_JUSTIFY = exports.ALIGN_RIGHT = exports.ALIGN_CENTER = exports.ALIGN_LEFT = exports.DEFAULT_FONT_SIZE = void 0;
exports.DEFAULT_FONT_SIZE = 13;
exports.ALIGN_LEFT = 'left';
exports.ALIGN_CENTER = 'center';
exports.ALIGN_RIGHT = 'right';
exports.ALIGN_JUSTIFY = 'justify';
exports.DEFAULT_ALIGNMENT = exports.ALIGN_LEFT;
exports.VERTICAL_ALIGN_TOP = 'top';
exports.VERTICAL_ALIGN_MIDDLE = 'middle';
exports.VERTICAL_ALIGN_BOTTOM = 'bottom';
exports.DEFAULT_VERTICAL_ALIGNMENT = exports.VERTICAL_ALIGN_TOP;
exports.DEFAULT_LINE_HEIGHT = 1;
exports.DEFAULT_CHARACTER_SPACING = 0;
exports.DEFAULT_FONT_COLOR = '#000000';
exports.PLACEHOLDER_FONT_COLOR = '#A0A0A0';
exports.DYNAMIC_FIT_VERTICAL = 'vertical';
exports.DYNAMIC_FIT_HORIZONTAL = 'horizontal';
exports.DEFAULT_DYNAMIC_FIT = exports.DYNAMIC_FIT_VERTICAL;
exports.DEFAULT_DYNAMIC_MIN_FONT_SIZE = 4;
exports.DEFAULT_DYNAMIC_MAX_FONT_SIZE = 72;
exports.FONT_SIZE_ADJUSTMENT = 0.25;
exports.LINE_START_FORBIDDEN_CHARS = [
    // 句読点
    '、',
    '。',
    ',',
    '.',
    // 閉じカッコ類
    '」',
    '』',
    ')',
    '}',
    '】',
    '>',
    '≫',
    ']',
    // 記号
    '・',
    'ー',
    '―',
    '-',
    // 約物
    '!',
    '！',
    '?',
    '？',
    ':',
    '：',
    ';',
    '；',
    '/',
    '／',
    // 繰り返し記号
    'ゝ',
    '々',
    '〃',
    // 拗音・促音（小書きのかな）
    'ぁ',
    'ぃ',
    'ぅ',
    'ぇ',
    'ぉ',
    'っ',
    'ゃ',
    'ゅ',
    'ょ',
    'ァ',
    'ィ',
    'ゥ',
    'ェ',
    'ォ',
    'ッ',
    'ャ',
    'ュ',
    'ョ',
];
exports.LINE_END_FORBIDDEN_CHARS = [
    // 始め括弧類
    '「',
    '『',
    '（',
    '｛',
    '【',
    '＜',
    '≪',
    '［',
    '〘',
    '〖',
    '〝',
    '‘',
    '“',
    '｟',
    '«',
];
//# sourceMappingURL=constants.js.map