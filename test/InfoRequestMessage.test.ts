import { MessageType } from '../src/MessageType';
import { InfoRequestMessage } from '../src/InfoRequestMessage';
import * as crypto from 'crypto'

describe('InfoRequestMessage', () => {

    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new InfoRequestMessage('test').type).toBe(MessageType.InfoRequest);
        });

        it('should set the correct id', () => {
            expect(new InfoRequestMessage('test123').id).toBe('test123');

            const id = crypto.randomUUID();
            expect(new InfoRequestMessage(id).id).toBe(id);
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new InfoRequestMessage('test').toUint8Array().length).toBe(5);
            expect(new InfoRequestMessage('test123').toUint8Array().length).toBe(8);

            // 36 bytes for the id
            const id = crypto.randomUUID();
            expect(new InfoRequestMessage(id).toUint8Array().length).toBe(1 + 36);
        });

        it('should serialise correctly', () => {
            expect(new InfoRequestMessage('test').toUint8Array()).toEqual(new Uint8Array([MessageType.InfoRequest, 116, 101, 115, 116]));
            expect(new InfoRequestMessage('Test123').toUint8Array()).toEqual(new Uint8Array([MessageType.InfoRequest, 84, 101, 115, 116, 49, 50, 51]));

            const id_1 = 'f376efd5-14af-4f21-9288-c3f1a1e02f74';
            const expectedBytes_1 = new Uint8Array([MessageType.InfoRequest, 102, 51, 55, 54, 101, 102, 100, 53, 45, 49, 52, 97, 102, 45, 52, 102, 50, 49, 45, 57, 50, 56, 56, 45, 99, 51, 102, 49, 97, 49, 101, 48, 50, 102, 55, 52]);
            expect(new InfoRequestMessage(id_1).toUint8Array()).toEqual(expectedBytes_1);
        });
    });

    describe('fromUint8Array', () => {
        it('should return null if the message type is incorrect', () => {
            expect(InfoRequestMessage.fromUint8Array(new Uint8Array([MessageType.Ack, 0]))).toBeNull();
        });

        it('should return null if the byte array is too short', () => {
            expect(InfoRequestMessage.fromUint8Array(new Uint8Array([]))).toBeNull();
            expect(InfoRequestMessage.fromUint8Array(new Uint8Array([MessageType.InfoRequest]))).toBeNull();
        });

        it('should parse a byte array correctly', () => {
            const id_1 = 'test';
            const InfoRequestMessage_1 = InfoRequestMessage.fromUint8Array(new Uint8Array([MessageType.InfoRequest, 116, 101, 115, 116]));
            expect(InfoRequestMessage_1).toEqual(new InfoRequestMessage(id_1));

            const id_2 = 'f376efd5-14af-4f21-9288-c3f1a1e02f74';
            const InfoRequestMessage_2 = InfoRequestMessage.fromUint8Array(new Uint8Array([
                MessageType.InfoRequest,
                102, 51, 55, 54, 101, 102, 100, 53, 45, 49, 52, 97, 102, 45, 52, 102, 50, 49, 45, 57, 50, 56, 56, 45, 99, 51, 102, 49, 97, 49, 101, 48, 50, 102, 55, 52]
            ));
            expect(InfoRequestMessage_2).toEqual(new InfoRequestMessage(id_2));
        });

        it('should parse a message that was serialised by toUint8Array correctly', () => {
            const InfoRequestMessage_1 = new InfoRequestMessage('test');
            expect(InfoRequestMessage.fromUint8Array(InfoRequestMessage_1.toUint8Array())).toEqual(InfoRequestMessage_1);

            const InfoRequestMessage_2 = new InfoRequestMessage('Test123');
            expect(InfoRequestMessage.fromUint8Array(InfoRequestMessage_2.toUint8Array())).toEqual(InfoRequestMessage_2);

            const InfoRequestMessage_3 = new InfoRequestMessage(crypto.randomUUID());
            expect(InfoRequestMessage.fromUint8Array(InfoRequestMessage_3.toUint8Array())).toEqual(InfoRequestMessage_3);
        });
    });

});
