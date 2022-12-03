import { MessageType } from '../src/MessageType';
import { InfoMessage } from '../src/InfoMessage';

describe('InfoMessage', () => {

    // UTF-8 Character sizes: Ϊ 2, Ϋ 2, ψ 2, И 2, д 2, ҡ 2, Ӫ 2, ← 3, Ⅱ 3, . 1, m 1, p 1, 3 1; TOTAL: 24
    const utf8Filename = 'ΪΫψИдҡӪ←Ⅱ.mp3';
    const utf8FilenameLength = 24;
    const utf8Bytes = [0xce, 0xaa, 0xce, 0xab, 0xcf, 0x88, 0xd0, 0x98, 0xd0, 0xb4, 0xd2, 0xa1, 0xd3, 0xaa, 0xe2, 0x86, 0x90, 0xe2, 0x85, 0xa1, 0x2e, 0x6d, 0x70, 0x33];

    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new InfoMessage('test', 0).type).toBe(MessageType.Info);
        });

        it('should set the correct name', () => {
            expect(new InfoMessage('test', 0).name).toBe('test');
            expect(new InfoMessage('test123.txt', 0).name).toBe('test123.txt');
            expect(new InfoMessage(utf8Filename, 0).name).toBe(utf8Filename);
        });

        it('should set the correct size', () => {
            expect(new InfoMessage('test', 0).size).toBe(0);
            expect(new InfoMessage('test', 123).size).toBe(123);
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new InfoMessage('test', 0).toUint8Array().length).toBe(9);
            expect(new InfoMessage('test', 123).toUint8Array().length).toBe(9);
            expect(new InfoMessage('test.txt', 123).toUint8Array().length).toBe(13);

            expect(new InfoMessage(utf8Filename, 123).toUint8Array().length).toBe(1 + 4 + utf8FilenameLength);
        });

        it('should serialise correctly', () => {
            expect(new InfoMessage('test', 0).toUint8Array()).toEqual(new Uint8Array([MessageType.Info, 0, 0, 0, 0, 0x74, 0x65, 0x73, 0x74]));
            // 32-bit size is little-endian
            expect(new InfoMessage('test', 123).toUint8Array()).toEqual(new Uint8Array([MessageType.Info, 0x7b, 0, 0, 0, 0x74, 0x65, 0x73, 0x74]));
            expect(new InfoMessage('test.txt', 123).toUint8Array()).toEqual(new Uint8Array([MessageType.Info, 0x7b, 0, 0, 0, 0x74, 0x65, 0x73, 0x74, 0x2e, 0x74, 0x78, 0x74]));

            const expectedBytes_1 = new Uint8Array([MessageType.Info, 0x7b, 0, 0, 0, ...utf8Bytes]);
            expect(new InfoMessage(utf8Filename, 123).toUint8Array()).toEqual(expectedBytes_1);

            const expectedBytes_2 = new Uint8Array([MessageType.Info, 0x15, 0xcd, 0x5b, 0x07, ...utf8Bytes]);
            expect(new InfoMessage(utf8Filename, 123456789).toUint8Array()).toEqual(expectedBytes_2);

            const expectedBytes_3 = new Uint8Array([MessageType.Info, 0xff, 0xff, 0xff, 0xff, ...utf8Bytes]);
            expect(new InfoMessage(utf8Filename, 4294967295).toUint8Array()).toEqual(expectedBytes_3);
        });
    });

    describe('fromUint8Array', () => {
        it('should return null if the message type is incorrect', () => {
            expect(InfoMessage.fromUint8Array(new Uint8Array([MessageType.Ack, 0, 0, 0, 0, 0]))).toBeNull();
        });

        it('should return null if the byte array is too short', () => {
            expect(InfoMessage.fromUint8Array(new Uint8Array([MessageType.Info, 0]))).toBeNull();
            expect(InfoMessage.fromUint8Array(new Uint8Array([MessageType.Info, 0, 0, 0, 0]))).toBeNull();
            expect(InfoMessage.fromUint8Array(new Uint8Array([MessageType.Info, 0x74, 0x65, 0x73, 0x00]))).toBeNull();
        });

        it('should parse a byte array correctly', () => {
            const InfoMessage_1 = InfoMessage.fromUint8Array(new Uint8Array([MessageType.Info, 0x7b, 0, 0, 0, 0x74, 0x65, 0x73, 0x74]));
            expect(InfoMessage_1).toEqual(new InfoMessage('test', 123));

            const InfoMessage_2 = InfoMessage.fromUint8Array(new Uint8Array([MessageType.Info, 0x15, 0xcd, 0x5b, 0x07, ...utf8Bytes]));
            expect(InfoMessage_2).toEqual(new InfoMessage(utf8Filename, 123456789));
        });

        it('should parse a message that was serialised by toUint8Array correctly', () => {
            const InfoMessage_1 = new InfoMessage('test', 123);
            expect(InfoMessage.fromUint8Array(InfoMessage_1.toUint8Array())).toEqual(InfoMessage_1);

            const InfoMessage_2 = new InfoMessage('test123.txt', 4294967295);
            expect(InfoMessage.fromUint8Array(InfoMessage_2.toUint8Array())).toEqual(InfoMessage_2);

            const InfoMessage_3 = new InfoMessage(utf8Filename, 123456789);
            expect(InfoMessage.fromUint8Array(InfoMessage_3.toUint8Array())).toEqual(InfoMessage_3);
        });
    });

});
