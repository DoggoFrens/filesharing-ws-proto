import { ChunkMessage } from '../src/ChunkMessage';
import { MessageType } from '../src/MessageType';

describe('ChunkMessage', () => {

    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new ChunkMessage(0, new Uint8Array([0])).type).toBe(MessageType.Chunk);
        });

        it('should set the correct chunk number', () => {
            expect(new ChunkMessage(0, new Uint8Array([0])).chunkNumber).toBe(0);
            expect(new ChunkMessage(1, new Uint8Array([0])).chunkNumber).toBe(1);
            expect(new ChunkMessage(123, new Uint8Array([0])).chunkNumber).toBe(123);
        });

        it('should set the correct chunk bytes', () => {
            expect(new ChunkMessage(0, new Uint8Array([])).chunkBytes).toEqual(new Uint8Array([]));
            expect(new ChunkMessage(0, new Uint8Array([0])).chunkBytes).toEqual(new Uint8Array([0]));
            expect(new ChunkMessage(0, new Uint8Array([0, 1, 2, 3])).chunkBytes).toEqual(new Uint8Array([0, 1, 2, 3]));
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new ChunkMessage(0, new Uint8Array([])).toUint8Array().length).toBe(2);
            expect(new ChunkMessage(0, new Uint8Array([0])).toUint8Array().length).toBe(3);
            expect(new ChunkMessage(0, new Uint8Array([0, 1, 2, 3])).toUint8Array().length).toBe(6);
        });

        it('should serialise correctly', () => {
            expect(new ChunkMessage(0, new Uint8Array([])).toUint8Array()).toEqual(new Uint8Array([MessageType.Chunk, 0]));
            expect(new ChunkMessage(0, new Uint8Array([0])).toUint8Array()).toEqual(new Uint8Array([MessageType.Chunk, 0, 0]));
            expect(new ChunkMessage(0, new Uint8Array([0, 1, 2, 3])).toUint8Array()).toEqual(new Uint8Array([MessageType.Chunk, 0, 0, 1, 2, 3]));
            expect(new ChunkMessage(255, new Uint8Array([0, 1, 2, 3])).toUint8Array()).toEqual(new Uint8Array([MessageType.Chunk, 255, 0, 1, 2, 3]));
        });
    });

    describe('fromUint8Array', () => {
        it('should return null if the message type is incorrect', () => {
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Ack, 0]))).toBeNull();
        });

        it('should return null if the chunk size is different than expected', () => {
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Chunk, 0, 0, 0]), 1)).toBeNull();
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Chunk, 0, 0, 0]), 3)).toBeNull();
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Chunk, 0, 0, 0, 0, 0, 0]), 3)).toBeNull();
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Chunk, 0, 0, 0, 0, 0, 0]), 6)).toBeNull();
        });

        it('should parse a byte array correctly', () => {
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Chunk, 0]))).toEqual(new ChunkMessage(0, new Uint8Array([])));
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Chunk, 0, 0]))).toEqual(new ChunkMessage(0, new Uint8Array([0])));
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Chunk, 0, 0, 1, 2, 3]))).toEqual(new ChunkMessage(0, new Uint8Array([0, 1, 2, 3])));
            expect(ChunkMessage.fromUint8Array(new Uint8Array([MessageType.Chunk, 255, 0, 1, 2, 3]))).toEqual(new ChunkMessage(255, new Uint8Array([0, 1, 2, 3])));
        });

        it('should parse a message that was serialised by toUint8Array correctly', () => {
            expect(ChunkMessage.fromUint8Array(new ChunkMessage(0, new Uint8Array([])).toUint8Array())).toEqual(new ChunkMessage(0, new Uint8Array([])));
            expect(ChunkMessage.fromUint8Array(new ChunkMessage(0, new Uint8Array([0])).toUint8Array())).toEqual(new ChunkMessage(0, new Uint8Array([0])));
            expect(ChunkMessage.fromUint8Array(new ChunkMessage(0, new Uint8Array([0, 1, 2, 3])).toUint8Array())).toEqual(new ChunkMessage(0, new Uint8Array([0, 1, 2, 3])));
            expect(ChunkMessage.fromUint8Array(new ChunkMessage(255, new Uint8Array([0, 1, 2, 3])).toUint8Array())).toEqual(new ChunkMessage(255, new Uint8Array([0, 1, 2, 3])));
        });
    });

});
