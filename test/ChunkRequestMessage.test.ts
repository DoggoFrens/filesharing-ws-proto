import { ChunkRequestMessage } from '../src/ChunkRequestMessage';
import { MessageType } from '../src/MessageType';

describe('ChunkRequestMessage', () => {

    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new ChunkRequestMessage(123).type).toBe(MessageType.ChunkRequest);
        });

        it('should set the correct chunk size', () => {
            expect(new ChunkRequestMessage(0).number).toBe(0);
            expect(new ChunkRequestMessage(123).number).toBe(123);
            expect(new ChunkRequestMessage(255).number).toBe(255);
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new ChunkRequestMessage(0).toUint8Array().length).toBe(2);
            expect(new ChunkRequestMessage(123).toUint8Array().length).toBe(2);
            expect(new ChunkRequestMessage(255).toUint8Array().length).toBe(2);
        });

        it('should serialise correctly', () => {
            expect(new ChunkRequestMessage(0).toUint8Array()).toEqual(new Uint8Array([MessageType.ChunkRequest, 0]));
            expect(new ChunkRequestMessage(123).toUint8Array()).toEqual(new Uint8Array([MessageType.ChunkRequest, 0x7b]));
            expect(new ChunkRequestMessage(255).toUint8Array()).toEqual(new Uint8Array([MessageType.ChunkRequest, 0xff]));
        });
    });

    describe('fromUint8Array', () => {
        it('should return null if the message type is incorrect', () => {
            expect(ChunkRequestMessage.fromUint8Array(new Uint8Array([MessageType.Ack, 0]))).toBeNull();
        });

        it('should return null if the byte array is too short', () => {
            expect(ChunkRequestMessage.fromUint8Array(new Uint8Array([MessageType.ChunkRequest]))).toBeNull();
            expect(ChunkRequestMessage.fromUint8Array(new Uint8Array([0]))).toBeNull();
            expect(ChunkRequestMessage.fromUint8Array(new Uint8Array([]))).toBeNull();
        });

        it('should parse a byte array correctly', () => {
            const ChunkRequestMessage_1 = ChunkRequestMessage.fromUint8Array(new Uint8Array([MessageType.ChunkRequest, 0x7b]));
            expect(ChunkRequestMessage_1).toEqual(new ChunkRequestMessage(123));

            const ChunkRequestMessage_2 = ChunkRequestMessage.fromUint8Array(new Uint8Array([MessageType.ChunkRequest, 0xff]));
            expect(ChunkRequestMessage_2).toEqual(new ChunkRequestMessage(255));
        });

        it('should parse a message that was serialised by toUint8Array correctly', () => {
            const ChunkRequestMessage_1 = new ChunkRequestMessage(123);
            expect(ChunkRequestMessage.fromUint8Array(ChunkRequestMessage_1.toUint8Array())).toEqual(ChunkRequestMessage_1);

            const ChunkRequestMessage_2 = new ChunkRequestMessage(255);
            expect(ChunkRequestMessage.fromUint8Array(ChunkRequestMessage_2.toUint8Array())).toEqual(ChunkRequestMessage_2);
        });
    });

})