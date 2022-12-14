import { Buffer } from 'buffer/';
import { MessageType } from './MessageType';
import { Message } from "./Message";

/**
 * A message that contains information about a file.
 *
 * @extends Message
 */
export class InfoMessage extends Message {

    /**
     * The name of the file.
     *
     * @type {string}
     * @readonly
     */
    readonly name: string;

    /**
     * The size of the file in bytes.
     *
     * @type {number}
     * @readonly
     */
    readonly size: number;

    /**
     * @param name The name of the file.
     * @param size The size of the file in bytes.
     */
    constructor(name: string, size: number) {
        super(MessageType.Info);
        this.name = name;
        this.size = size;
    }

    /**
     * Parses a InfoMessage from a Uint8Array.
     *
     * @param byteArray The byte array to parse.
     * @returns The parsed InfoMessage, or null if the byte array is invalid.
     */
    static fromUint8Array(byteArray: Uint8Array): InfoMessage | null {
        // Minimum size: 1 (type) + 4 (size) + 1 (name with at least one byte)
        if (byteArray.length < 6) {
            return null;
        }

        //TODO: Return null if size is too big

        if (byteArray[0] !== MessageType.Info) {
            return null;
        }

        // Size is received as a 32-bit unsigned integer in little endian
        const size: number = new DataView(byteArray.slice(1, 5).buffer).getUint32(0, true);
        const name: string = Buffer.from(byteArray.slice(5)).toString('utf8');

        return new InfoMessage(name, size);
    }

    /**
     * @override
     */
    toUint8Array(): Uint8Array {
        const nameBytes: Uint8Array = Buffer.from(this.name, 'utf8');
        // Size is sent as a 32-bit unsigned integer in little endian
        const sizeDataView = new DataView(new ArrayBuffer(4));
        sizeDataView.setUint32(0, this.size, true);
        const sizeBytes: Uint8Array = new Uint8Array(sizeDataView.buffer);

        const byteArray = new Uint8Array(1 + 4 + nameBytes.byteLength);
        byteArray[0] = this.type;
        byteArray.set(sizeBytes, 1);
        byteArray.set(nameBytes, 5);

        return byteArray;
    }

}
