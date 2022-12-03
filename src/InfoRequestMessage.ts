import { Buffer } from 'buffer/';
import { MessageType } from './MessageType';
import { Message } from "./Message";

/**
 * A message that is sent to the uploader when the WebSocket connection
 * is established, requesting information about the file.
 *
 * @extends Message
 */
export class InfoRequestMessage extends Message {

    /**
     * The session ID.
     * @type {string}
     * @readonly
     */
    readonly id: string;

    /**
     * @param id The session ID.
     */
    constructor(id: string) {
        super(MessageType.InfoRequest);
        this.id = id;
    }

    /**
     * Parses a InfoRequestMessage from a Uint8Array.
     *
     * @param byteArray The byte array to parse.
     * @returns The parsed InfoRequestMessage, or null if the byte array is invalid.
     */
    static fromUint8Array(byteArray: Uint8Array): InfoRequestMessage | null {
        if (byteArray.length <= 1) {
            return null;
        }

        if (byteArray[0] !== MessageType.InfoRequest) {
            return null;
        }

        const id = Buffer.from(byteArray.slice(1)).toString('utf8');

        return new InfoRequestMessage(id);
    }

    /**
     * @override
     */
    toUint8Array(): Uint8Array {
        const messageBytes = new Uint8Array(1 + this.id.length);
        messageBytes[0] = this.type;
        messageBytes.set(Buffer.from(this.id, 'utf8'), 1);

        return messageBytes;
    }

}
