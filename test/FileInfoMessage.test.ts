import { MessageType } from '../src/MessageType';
import { FileInfoMessage } from '../src/FileInfoMessage';

describe('FileInfoMessage', () => {

    // UTF-8 Character sizes: Ϊ 2, Ϋ 2, ψ 2, И 2, д 2, ҡ 2, Ӫ 2, ← 3, Ⅱ 3, . 1, m 1, p 1, 3 1; TOTAL: 24
    const utf8Filename = 'ΪΫψИдҡӪ←Ⅱ.mp3';
    const utf8FilenameLength = 24;
    const utf8Bytes = [0xce, 0xaa, 0xce, 0xab, 0xcf, 0x88, 0xd0, 0x98, 0xd0, 0xb4, 0xd2, 0xa1, 0xd3, 0xaa, 0xe2, 0x86, 0x90, 0xe2, 0x85, 0xa1, 0x2e, 0x6d, 0x70, 0x33];

    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new FileInfoMessage('test', 0).type).toBe(MessageType.FileInfo);
        });

        it('should set the correct name', () => {
            expect(new FileInfoMessage('test', 0).name).toBe('test');
            expect(new FileInfoMessage('test123.txt', 0).name).toBe('test123.txt');
            expect(new FileInfoMessage(utf8Filename, 0).name).toBe(utf8Filename);
        });

        it('should set the correct size', () => {
            expect(new FileInfoMessage('test', 0).size).toBe(0);
            expect(new FileInfoMessage('test', 123).size).toBe(123);
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new FileInfoMessage('test', 0).toUint8Array().length).toBe(9);
            expect(new FileInfoMessage('test', 123).toUint8Array().length).toBe(9);
            expect(new FileInfoMessage('test.txt', 123).toUint8Array().length).toBe(13);
            
            expect(new FileInfoMessage(utf8Filename, 123).toUint8Array().length).toBe(1 + 4 + utf8FilenameLength);
        });

        it('should serialise correctly', () => {
            expect(new FileInfoMessage('test', 0).toUint8Array()).toEqual(new Uint8Array([MessageType.FileInfo, 0, 0, 0, 0, 0x74, 0x65, 0x73, 0x74]));
            // 32-bit size is little-endian
            expect(new FileInfoMessage('test', 123).toUint8Array()).toEqual(new Uint8Array([MessageType.FileInfo, 0x7b, 0, 0, 0, 0x74, 0x65, 0x73, 0x74]));
            expect(new FileInfoMessage('test.txt', 123).toUint8Array()).toEqual(new Uint8Array([MessageType.FileInfo, 0x7b, 0, 0, 0, 0x74, 0x65, 0x73, 0x74, 0x2e, 0x74, 0x78, 0x74]));
            
            const expectedBytes_1 = new Uint8Array([MessageType.FileInfo, 0x7b, 0, 0, 0, ...utf8Bytes]);
            expect(new FileInfoMessage(utf8Filename, 123).toUint8Array()).toEqual(expectedBytes_1);

            const expectedBytes_2 = new Uint8Array([MessageType.FileInfo, 0x15, 0xcd, 0x5b, 0x07, ...utf8Bytes]);
            expect(new FileInfoMessage(utf8Filename, 123456789).toUint8Array()).toEqual(expectedBytes_2);

            const expectedBytes_3 = new Uint8Array([MessageType.FileInfo, 0xff, 0xff, 0xff, 0xff, ...utf8Bytes]);
            expect(new FileInfoMessage(utf8Filename, 4294967295).toUint8Array()).toEqual(expectedBytes_3);
        });
    });

    describe('fromUint8Array', () => {
        it('should return null if the message type is incorrect', () => {
            expect(FileInfoMessage.fromUint8Array(new Uint8Array([MessageType.Ack, 0, 0, 0, 0, 0]))).toBeNull();
        });

        it('should return null if the byte array is too short', () => {
            expect(FileInfoMessage.fromUint8Array(new Uint8Array([MessageType.FileInfo, 0]))).toBeNull();
            expect(FileInfoMessage.fromUint8Array(new Uint8Array([MessageType.FileInfo, 0, 0, 0, 0]))).toBeNull();
            expect(FileInfoMessage.fromUint8Array(new Uint8Array([MessageType.FileInfo, 0x74, 0x65, 0x73, 0x00]))).toBeNull();
        });

        it('should parse a byte array correctly', () => {
            const fileInfoMessage_1 = FileInfoMessage.fromUint8Array(new Uint8Array([MessageType.FileInfo, 0x7b, 0, 0, 0, 0x74, 0x65, 0x73, 0x74]));
            expect(fileInfoMessage_1).toEqual(new FileInfoMessage('test', 123));

            const fileInfoMessage_2 = FileInfoMessage.fromUint8Array(new Uint8Array([MessageType.FileInfo, 0x15, 0xcd, 0x5b, 0x07, ...utf8Bytes]));
            expect(fileInfoMessage_2).toEqual(new FileInfoMessage(utf8Filename, 123456789));
        });

        it('should parse a message that was serialised by toUint8Array correctly', () => {
            const fileInfoMessage_1 = new FileInfoMessage('test', 123);
            expect(FileInfoMessage.fromUint8Array(fileInfoMessage_1.toUint8Array())).toEqual(fileInfoMessage_1);

            const fileInfoMessage_2 = new FileInfoMessage('test123.txt', 4294967295);
            expect(FileInfoMessage.fromUint8Array(fileInfoMessage_2.toUint8Array())).toEqual(fileInfoMessage_2);

            const fileInfoMessage_3 = new FileInfoMessage(utf8Filename, 123456789);
            expect(FileInfoMessage.fromUint8Array(fileInfoMessage_3.toUint8Array())).toEqual(fileInfoMessage_3);
        });
    });

});
