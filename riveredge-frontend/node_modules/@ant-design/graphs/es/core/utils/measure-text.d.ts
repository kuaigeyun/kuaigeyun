/**
 * 计算文本尺寸
 * @param text - 文本内容
 * @param offset - 水平和垂直偏移量，默认为 [0, 0]，用于调整文本节点的大小
 * @param font - 字体样式
 * @param minWidth - 最小宽度，默认为 0
 * @param maxWith - 最大宽度，默认为 Infinity；超出部分会被自动换行
 * @returns 文本尺寸（包括宽度和高度）
 */
export declare function measureTextSize(text: string, offset?: number[], font?: any, minWidth?: number, maxWith?: number): [number, number];
