import { Message } from "./Message";
import { MessageType } from "./MessageType";

/**
 * A message that contains information about a file.
 *
 * @extends Message
 */
 export class ChunkSizeInfoMessage extends Message {

    /**
     * The chunk size. The last chunk may be smaller than this.
     *
     * @type {string}
     * @readonly
     */
    readonly chunkSize: number;

    /**
     * @param chunkSize The chunk size.
     */
    constructor(chunkSize: number) {
        super(MessageType.ChunkSizeInfo);
        this.chunkSize = chunkSize;
    }

    /**
     * Parses a ChunkSizeInfoMessage from a Uint8Array.
     *
     * @param byteArray The byte array to parse.
     * @returns The parsed ChunkSizeInfoMessage, or null if the byte array is invalid.
     */
     static fromUint8Array(byteArray: Uint8Array): ChunkSizeInfoMessage | null {
        // Minimum size: 1 (type) + 4 (chunkSize)
        if (byteArray.length < 5) {
            return null;
        }

        if (byteArray[0] !== MessageType.ChunkSizeInfo) {
            return null;
        }

        // Size is received as a 32-bit unsigned integer in little endian
        const chunkSize: number = new DataView(byteArray.slice(1).buffer).getUint32(0, true);

        return new ChunkSizeInfoMessage(chunkSize);
    }

    /**
     * @override
     */
     toUint8Array(): Uint8Array {
        // Chunk size is sent as a 32-bit unsigned integer in little endian
        const chunkSizeDataView = new DataView(new ArrayBuffer(4));
        chunkSizeDataView.setUint32(0, this.chunkSize, true);
        const chunkSizeBytes: Uint8Array = new Uint8Array(chunkSizeDataView.buffer);

        const byteArray = new Uint8Array(1 + 4);
        byteArray[0] = this.type;
        byteArray.set(chunkSizeBytes, 1);

        return byteArray;
    }

}
