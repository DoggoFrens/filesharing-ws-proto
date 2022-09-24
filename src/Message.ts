import { MessageType } from './MessageType';

/**
 * An abstract class that represents a WebSocket message.
 */
export abstract class Message {

    /**
     * The type of the message.
     *
     * @type {MessageType}
     * @readonly
     */
    readonly type: MessageType;

    /**
     * @param type The type of the message.
     * @see MessageType
     */
    constructor(type: MessageType) {
        this.type = type;
    }

    /**
     * Returns the whole message as a Uint8Array.
     */
    abstract toUint8Array(): Uint8Array;

}
