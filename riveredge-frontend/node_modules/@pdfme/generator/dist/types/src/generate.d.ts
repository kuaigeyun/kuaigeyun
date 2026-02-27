import type { GenerateProps } from '@pdfme/common';
declare const generate: (props: GenerateProps) => Promise<Uint8Array<ArrayBuffer>>;
export default generate;
