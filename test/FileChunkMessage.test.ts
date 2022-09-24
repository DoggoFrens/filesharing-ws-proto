import { FileChunkMessage } from '../src/FileChunkMessage';
import { MessageType } from '../src/MessageType';

describe('FileChunkMessage', () => {

    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new FileChunkMessage(0, new Uint8Array([0])).type).toBe(MessageType.FileChunk);
        });
    
        it('should set the correct chunk number', () => {
            expect(new FileChunkMessage(0, new Uint8Array([0])).chunkNumber).toBe(0);
            expect(new FileChunkMessage(1, new Uint8Array([0])).chunkNumber).toBe(1);
            expect(new FileChunkMessage(123, new Uint8Array([0])).chunkNumber).toBe(123);
        });
    
        it('should set the correct chunk bytes', () => {
            expect(new FileChunkMessage(0, new Uint8Array([])).chunkBytes).toEqual(new Uint8Array([]));
            expect(new FileChunkMessage(0, new Uint8Array([0])).chunkBytes).toEqual(new Uint8Array([0]));
            expect(new FileChunkMessage(0, new Uint8Array([0, 1, 2, 3])).chunkBytes).toEqual(new Uint8Array([0, 1, 2, 3]));
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new FileChunkMessage(0, new Uint8Array([])).toUint8Array().length).toBe(2);
            expect(new FileChunkMessage(0, new Uint8Array([0])).toUint8Array().length).toBe(3);
            expect(new FileChunkMessage(0, new Uint8Array([0, 1, 2, 3])).toUint8Array().length).toBe(6);
        });
    
        it('should serialise correctly', () => {
            expect(new FileChunkMessage(0, new Uint8Array([])).toUint8Array()).toEqual(new Uint8Array([MessageType.FileChunk, 0]));
            expect(new FileChunkMessage(0, new Uint8Array([0])).toUint8Array()).toEqual(new Uint8Array([MessageType.FileChunk, 0, 0]));
            expect(new FileChunkMessage(0, new Uint8Array([0, 1, 2, 3])).toUint8Array()).toEqual(new Uint8Array([MessageType.FileChunk, 0, 0, 1, 2, 3]));
            expect(new FileChunkMessage(255, new Uint8Array([0, 1, 2, 3])).toUint8Array()).toEqual(new Uint8Array([MessageType.FileChunk, 255, 0, 1, 2, 3]));
        });
    });

    describe('fromUint8Array', () => {
        it('should return null if the message type is incorrect', () => {
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.Ack, 0]))).toBeNull();
        });
    
        it('should return null if the chunk size is different than expected', () => {
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.FileChunk, 0, 0, 0]), 1)).toBeNull();
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.FileChunk, 0, 0, 0]), 3)).toBeNull();
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.FileChunk, 0, 0, 0, 0, 0, 0]), 3)).toBeNull();
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.FileChunk, 0, 0, 0, 0, 0, 0]), 6)).toBeNull();
        });

        it('should parse a byte array correctly', () => {
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.FileChunk, 0]))).toEqual(new FileChunkMessage(0, new Uint8Array([])));
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.FileChunk, 0, 0]))).toEqual(new FileChunkMessage(0, new Uint8Array([0])));
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.FileChunk, 0, 0, 1, 2, 3]))).toEqual(new FileChunkMessage(0, new Uint8Array([0, 1, 2, 3])));
            expect(FileChunkMessage.fromUint8Array(new Uint8Array([MessageType.FileChunk, 255, 0, 1, 2, 3]))).toEqual(new FileChunkMessage(255, new Uint8Array([0, 1, 2, 3])));
        });

        it('should parse a message that was serialised by toUint8Array correctly', () => {
            expect(FileChunkMessage.fromUint8Array(new FileChunkMessage(0, new Uint8Array([])).toUint8Array())).toEqual(new FileChunkMessage(0, new Uint8Array([])));
            expect(FileChunkMessage.fromUint8Array(new FileChunkMessage(0, new Uint8Array([0])).toUint8Array())).toEqual(new FileChunkMessage(0, new Uint8Array([0])));
            expect(FileChunkMessage.fromUint8Array(new FileChunkMessage(0, new Uint8Array([0, 1, 2, 3])).toUint8Array())).toEqual(new FileChunkMessage(0, new Uint8Array([0, 1, 2, 3])));
            expect(FileChunkMessage.fromUint8Array(new FileChunkMessage(255, new Uint8Array([0, 1, 2, 3])).toUint8Array())).toEqual(new FileChunkMessage(255, new Uint8Array([0, 1, 2, 3])));
        });
    });

});
