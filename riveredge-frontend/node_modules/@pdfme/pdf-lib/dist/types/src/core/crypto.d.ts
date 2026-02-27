import PDFDict from './objects/PDFDict.js';
import PDFName from './objects/PDFName.js';
import DecryptStream from './streams/DecryptStream.js';
import { StreamType } from './streams/Stream.js';
declare class ARCFourCipher {
    private s;
    private a;
    private b;
    constructor(key: Uint8Array);
    encryptBlock(data: Uint8Array): Uint8Array<ArrayBuffer>;
    decryptBlock(data: Uint8Array): Uint8Array<ArrayBuffer>;
    encrypt(data: Uint8Array): Uint8Array<ArrayBuffer>;
}
declare const calculateMD5: (data: Uint8Array, offset: number, length: number) => Uint8Array<ArrayBuffer>;
declare const calculateSHA256: (data: Uint8Array, offset: number, length: number) => Uint8Array<ArrayBuffer>;
declare const calculateSHA512: (data: Uint8Array, offset: number, length: number, mode384?: boolean) => Uint8Array<ArrayBuffer>;
declare function calculateSHA384(data: Uint8Array, offset: number, length: number): Uint8Array<ArrayBuffer>;
declare class NullCipher {
    decryptBlock(data: Uint8Array): Uint8Array<ArrayBufferLike>;
    encrypt(data: Uint8Array): Uint8Array<ArrayBufferLike>;
}
declare class AESBaseCipher {
    protected _s: Uint8Array;
    protected _keySize: number;
    protected _key: Uint8Array;
    protected _cyclesOfRepetition: number;
    private _inv_s;
    private _mix;
    private _mixCol;
    buffer: Uint8Array;
    bufferPosition: number;
    bufferLength: number;
    iv: Uint8Array;
    constructor();
    _expandKey(_cipherKey: Uint8Array): void;
    _decrypt(input: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer>;
    _encrypt(input: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer>;
    _decryptBlock2(data: Uint8Array, finalize: boolean): Uint8Array<ArrayBuffer>;
    decryptBlock(data: Uint8Array, finalize: boolean, iv?: Uint8Array): Uint8Array;
    encrypt(data: Uint8Array, iv: Uint8Array): Uint8Array<ArrayBuffer>;
}
declare class AES128Cipher extends AESBaseCipher {
    private _rcon;
    constructor(key: Uint8Array);
    _expandKey(cipherKey: Uint8Array): Uint8Array<ArrayBuffer>;
}
declare class AES256Cipher extends AESBaseCipher {
    constructor(key: Uint8Array);
    _expandKey(cipherKey: Uint8Array): Uint8Array<ArrayBuffer>;
}
declare class PDF17 {
    checkOwnerPassword(password: Uint8Array, ownerValidationSalt: Uint8Array, userBytes: Uint8Array, ownerPassword: Uint8Array): boolean;
    checkUserPassword(password: Uint8Array, userValidationSalt: Uint8Array, userPassword: Uint8Array): boolean;
    getOwnerKey(password: Uint8Array, ownerKeySalt: Uint8Array, userBytes: Uint8Array, ownerEncryption: Uint8Array): Uint8Array<ArrayBufferLike>;
    getUserKey(password: Uint8Array, userKeySalt: Uint8Array, userEncryption: Uint8Array): Uint8Array<ArrayBufferLike>;
}
declare class PDF20 {
    calculatePDF20Hash(password: Uint8Array, input: Uint8Array, userBytes: Uint8Array): Uint8Array<ArrayBuffer>;
    hash(password: Uint8Array, concatBytes: Uint8Array, userBytes: Uint8Array): Uint8Array<ArrayBuffer>;
    checkOwnerPassword(password: Uint8Array, ownerValidationSalt: Uint8Array, userBytes: Uint8Array, ownerPassword: Uint8Array): boolean;
    checkUserPassword(password: Uint8Array, userValidationSalt: Uint8Array, userPassword: Uint8Array): boolean;
    getOwnerKey(password: Uint8Array, ownerKeySalt: Uint8Array, userBytes: Uint8Array, ownerEncryption: Uint8Array): Uint8Array<ArrayBufferLike>;
    getUserKey(password: Uint8Array, userKeySalt: Uint8Array, userEncryption: Uint8Array): Uint8Array<ArrayBufferLike>;
}
type Cipher = ARCFourCipher | NullCipher | AES128Cipher | AES256Cipher;
declare class CipherTransform {
    private StringCipherConstructor;
    private StreamCipherConstructor;
    constructor(stringCipherConstructor: () => Cipher, streamCipherConstructor: () => Cipher);
    createStream(stream: StreamType, length: number): DecryptStream;
    decryptString(s: string): string;
    decryptBytes(d: Uint8Array): Uint8Array<ArrayBufferLike>;
    encryptString(s: string): string;
}
declare class CipherTransformFactory {
    encryptMetadata: boolean;
    encryptionKey: Uint8Array;
    algorithm: number;
    filterName: string;
    dict: PDFDict;
    cf: PDFDict;
    stmf: PDFName;
    strf: PDFName;
    eff: PDFName;
    private defaultPasswordBytes;
    private identityName;
    constructor(dict: PDFDict, fileIdBytes: Uint8Array, password?: string);
    createCipherTransform(num: number, gen: number): CipherTransform;
    createEncryptionKey20(revision: number, password: Uint8Array | undefined, ownerPassword: Uint8Array, ownerValidationSalt: Uint8Array, ownerKeySalt: Uint8Array, uBytes: Uint8Array, userPassword: Uint8Array, userValidationSalt: Uint8Array, userKeySalt: Uint8Array, ownerEncryption: Uint8Array, userEncryption: Uint8Array, _perms: Uint8Array): Uint8Array<ArrayBufferLike> | null;
    prepareKeyData(fileId: Uint8Array, password: Uint8Array | undefined, ownerPassword: Uint8Array, userPassword: Uint8Array, flags: number, revision: number, keyLength: number, encryptMetadata: boolean): Uint8Array<ArrayBuffer> | null;
    decodeUserPassword(password: Uint8Array, ownerPassword: Uint8Array, revision: number, keyLength: number): Uint8Array<ArrayBufferLike>;
    buildObjectKey(num: number, gen: number, encryptionKey: Uint8Array, isAes?: boolean): Uint8Array<ArrayBuffer>;
    buildCipherConstructor(cf: PDFDict, name: PDFName, num: number, gen: number, key: Uint8Array): (() => NullCipher) | (() => AES256Cipher);
}
export { AES128Cipher, AES256Cipher, ARCFourCipher, calculateMD5, calculateSHA256, calculateSHA384, calculateSHA512, CipherTransformFactory, CipherTransform, PDF17, PDF20, };
