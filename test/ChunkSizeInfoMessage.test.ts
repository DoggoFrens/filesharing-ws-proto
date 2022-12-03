import { ChunkSizeInfoMessage } from '../src/ChunkSizeInfoMessage';
import { MessageType } from '../src/MessageType';

describe('ChunkSizeInfoMessage', () => {

    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new ChunkSizeInfoMessage(123).type).toBe(MessageType.ChunkSizeInfo);
        });

        it('should set the correct chunk size', () => {
            expect(new ChunkSizeInfoMessage(0).chunkSize).toBe(0);
            expect(new ChunkSizeInfoMessage(123).chunkSize).toBe(123);
            expect(new ChunkSizeInfoMessage(4294967295).chunkSize).toBe(4294967295);
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new ChunkSizeInfoMessage(0).toUint8Array().length).toBe(5);
            expect(new ChunkSizeInfoMessage(123).toUint8Array().length).toBe(5);
            expect(new ChunkSizeInfoMessage(4294967295).toUint8Array().length).toBe(5);
        });

        it('should serialise correctly', () => {
            expect(new ChunkSizeInfoMessage(0).toUint8Array()).toEqual(new Uint8Array([MessageType.ChunkSizeInfo, 0, 0, 0, 0]));
            expect(new ChunkSizeInfoMessage(255).toUint8Array()).toEqual(new Uint8Array([MessageType.ChunkSizeInfo, 0xff, 0, 0, 0]));
            expect(new ChunkSizeInfoMessage(256).toUint8Array()).toEqual(new Uint8Array([MessageType.ChunkSizeInfo, 0, 1, 0, 0]));
        });
    });

    describe('fromUint8Array', () => {
        it('should return null if the message type is incorrect', () => {
            expect(ChunkSizeInfoMessage.fromUint8Array(new Uint8Array([MessageType.Ack, 0, 0, 0, 0]))).toBeNull();
        });

        it('should return null if the byte array is too short', () => {
            expect(ChunkSizeInfoMessage.fromUint8Array(new Uint8Array([MessageType.ChunkSizeInfo, 0]))).toBeNull();
            expect(ChunkSizeInfoMessage.fromUint8Array(new Uint8Array([MessageType.ChunkSizeInfo, 0, 0, 0]))).toBeNull();
            expect(ChunkSizeInfoMessage.fromUint8Array(new Uint8Array([MessageType.ChunkSizeInfo, 0x74, 0x65, 0x73]))).toBeNull();
        });

        it('should parse a byte array correctly', () => {
            const ChunkSizeInfoMessage_1 = ChunkSizeInfoMessage.fromUint8Array(new Uint8Array([MessageType.ChunkSizeInfo, 0x7b, 0, 0, 0]));
            expect(ChunkSizeInfoMessage_1).toEqual(new ChunkSizeInfoMessage(123));

            const ChunkSizeInfoMessage_2 = ChunkSizeInfoMessage.fromUint8Array(new Uint8Array([MessageType.ChunkSizeInfo, 0, 1, 0, 0]));
            expect(ChunkSizeInfoMessage_2).toEqual(new ChunkSizeInfoMessage(256));
        });

        it('should parse a message that was serialised by toUint8Array correctly', () => {
            const ChunkSizeInfoMessage_1 = new ChunkSizeInfoMessage(123);
            expect(ChunkSizeInfoMessage.fromUint8Array(ChunkSizeInfoMessage_1.toUint8Array())).toEqual(ChunkSizeInfoMessage_1);

            const ChunkSizeInfoMessage_2 = new ChunkSizeInfoMessage(256);
            expect(ChunkSizeInfoMessage.fromUint8Array(ChunkSizeInfoMessage_2.toUint8Array())).toEqual(ChunkSizeInfoMessage_2);

            const ChunkSizeInfoMessage_3 = new ChunkSizeInfoMessage(4294967295);
            expect(ChunkSizeInfoMessage.fromUint8Array(ChunkSizeInfoMessage_3.toUint8Array())).toEqual(ChunkSizeInfoMessage_3);
        });
    });

})