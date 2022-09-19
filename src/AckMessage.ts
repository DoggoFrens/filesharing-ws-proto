import { MessageType } from './MessageType';
import { Message } from "./Message";

/**
 * A message that is sent to acknowledge a received message.
 *
 * @extends Message
 */

export class AckMessage extends Message {

    constructor() {
        super(MessageType.Ack);
    }

    /**
     * @override
     */
    toUint8Array(): Uint8Array {
        return new Uint8Array([this.type]);
    }

}
