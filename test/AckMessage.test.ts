import { MessageType } from '../src/MessageType';
import { AckMessage } from '../src/AckMessage';

describe('AckMessage', () => {
    
    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new AckMessage().type).toBe(MessageType.Ack);
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new AckMessage().toUint8Array().length).toBe(1);
        });

        it('should serialise correctly', () => {
            expect(new AckMessage().toUint8Array()).toEqual(new Uint8Array([MessageType.Ack]));
        });
    });

});
