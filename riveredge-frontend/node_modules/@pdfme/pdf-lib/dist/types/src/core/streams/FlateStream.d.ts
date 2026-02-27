import DecodeStream from '../../core/streams/DecodeStream';
import { StreamType } from '../../core/streams/Stream';
declare class FlateStream extends DecodeStream {
    private stream;
    private codeSize;
    private codeBuf;
    constructor(stream: StreamType, maybeLength?: number);
    protected readBlock(): void;
    private getBits;
    private getCode;
    private generateHuffmanTable;
}
export default FlateStream;
