import type { Font as FontKitFont } from 'fontkit';
import { UIRenderProps } from '@pdfme/common';
import type { TextSchema } from './types.js';
export declare const uiRender: (arg: UIRenderProps<TextSchema>) => Promise<void>;
export declare const buildStyledTextContainer: (arg: UIRenderProps<TextSchema>, fontKitFont: FontKitFont, value: string) => HTMLDivElement;
/**
 * Firefox doesn't support 'plaintext-only' contentEditable mode, which we want to avoid mark-up.
 * This function adds a workaround for Firefox to make the contentEditable element behave like 'plaintext-only'.
 */
export declare const makeElementPlainTextContentEditable: (element: HTMLElement) => void;
export declare const mapVerticalAlignToFlex: (verticalAlignmentValue: string | undefined) => "center" | "flex-end" | "flex-start";
