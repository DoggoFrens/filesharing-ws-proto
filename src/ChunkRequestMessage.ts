import { Message } from "./Message";
import { MessageType } from "./MessageType";

/**
 * A message that is sent to the uploader when the server asks for
 * a file chunk.
 *
 * @extends Message
 */
 export class ChunkRequestMessage extends Message {

    /**
     * The chunk number.
     * @type {number}
     * @readonly
     */
    readonly number: number;

    /**
     * @param number The chunk number.
     */
    constructor(number: number) {
        super(MessageType.ChunkRequest);
        this.number = number;
    }

    /**
     * Parses a ChunkRequestMessage from a Uint8Array.
     *
     * @param byteArray The byte array to parse.
     * @returns The parsed ChunkRequestMessage, or null if the byte array is invalid.
     */
    static fromUint8Array(byteArray: Uint8Array): ChunkRequestMessage | null {
        if (byteArray.length <= 2) {
            return null;
        }

        if (byteArray[0] !== MessageType.ChunkRequest) {
            return null;
        }

        const number = byteArray[1];

        return new ChunkRequestMessage(number);
    }

    /**
     * @override
     */
    toUint8Array(): Uint8Array {
        const messageBytes = new Uint8Array(2);
        messageBytes[0] = this.type;
        messageBytes[1] = this.number;

        return messageBytes;
    }

}