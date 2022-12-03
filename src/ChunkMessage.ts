import { MessageType } from './MessageType';
import { Message } from "./Message";

/**
 * A message that contains a chunk of data.
 *
 * @extends Message
 */
export class ChunkMessage extends Message {

    /**
     * The number of the chunk, where 0 is the first chunk.
     *
     * @type {number}
     * @readonly
     */
    readonly chunkNumber: number;

    /**
     * The chunk data.
     *
     * @type {Uint8Array}
     * @readonly
     */
    readonly chunkBytes: Uint8Array;

    /**
     * @param chunkNumber The number of the chunk, where 0 is the first chunk.
     * @param chunkBytes The chunk data.
     */
    constructor(chunkNumber: number, chunkBytes: Uint8Array) {
        super(MessageType.Chunk);
        this.chunkNumber = chunkNumber;
        this.chunkBytes = chunkBytes;
    }

    /**
     * Parses a ChunkMessage from a Uint8Array.
     *
     * @param byteArray The byte array to parse.
     * @param expectedChunkSize The expected size of the chunk, in bytes.
     * @returns The parsed ChunkMessage, or null if the byte array is invalid.
     */
    static fromUint8Array(byteArray: Uint8Array, expectedChunkSize?: number): ChunkMessage | null {
        if (expectedChunkSize && byteArray.byteLength != 2 + expectedChunkSize) {
            return null;
        }

        if (byteArray[0] !== MessageType.Chunk) {
            return null;
        }

        const chunkNumber = byteArray[1];
        const chunkBytes = byteArray.slice(2);

        return new ChunkMessage(chunkNumber, chunkBytes);
    }

    /**
     * @override
     */
    toUint8Array(): Uint8Array {
        const byteArray = new Uint8Array(2 + this.chunkBytes.byteLength);
        byteArray[0] = this.type;
        byteArray[1] = this.chunkNumber;
        byteArray.set(this.chunkBytes, 2);

        return byteArray;
    }

}
