import { MessageType } from '../src/MessageType';
import { FileInfoRequestMessage } from '../src/FileInfoRequestMessage';
import * as crypto from 'crypto'

describe('FileInfoRequestMessage', () => {

    describe('constructor', () => {
        it('should set the correct type', () => {
            expect(new FileInfoRequestMessage('test').type).toBe(MessageType.FileInfoRequest);
        });

        it('should set the correct id', () => {
            expect(new FileInfoRequestMessage('test123').id).toBe('test123');
            
            const id = crypto.randomUUID();
            expect(new FileInfoRequestMessage(id).id).toBe(id);
        });
    });

    describe('toUint8Array', () => {
        it('should return a byte array with the correct length', () => {
            expect(new FileInfoRequestMessage('test').toUint8Array().length).toBe(5);
            expect(new FileInfoRequestMessage('test123').toUint8Array().length).toBe(8);

            // 36 bytes for the id
            const id = crypto.randomUUID();
            expect(new FileInfoRequestMessage(id).toUint8Array().length).toBe(1 + 36);
        });

        it('should serialise correctly', () => {
            expect(new FileInfoRequestMessage('test').toUint8Array()).toEqual(new Uint8Array([MessageType.FileInfoRequest, 116, 101, 115, 116]));
            expect(new FileInfoRequestMessage('Test123').toUint8Array()).toEqual(new Uint8Array([MessageType.FileInfoRequest, 84, 101, 115, 116, 49, 50, 51]));

            const id_1 = 'f376efd5-14af-4f21-9288-c3f1a1e02f74';
            const expectedBytes_1 = new Uint8Array([MessageType.FileInfoRequest, 102, 51, 55, 54, 101, 102, 100, 53, 45, 49, 52, 97, 102, 45, 52, 102, 50, 49, 45, 57, 50, 56, 56, 45, 99, 51, 102, 49, 97, 49, 101, 48, 50, 102, 55, 52]);
            expect(new FileInfoRequestMessage(id_1).toUint8Array()).toEqual(expectedBytes_1);
        });
    });

    describe('fromUint8Array', () => {
        it('should return null if the message type is incorrect', () => {
            expect(FileInfoRequestMessage.fromUint8Array(new Uint8Array([MessageType.Ack, 0]))).toBeNull();
        });

        it('should return null if the byte array is too short', () => {
            expect(FileInfoRequestMessage.fromUint8Array(new Uint8Array([]))).toBeNull();
            expect(FileInfoRequestMessage.fromUint8Array(new Uint8Array([MessageType.FileInfo]))).toBeNull();
        });

        it('should parse a byte array correctly', () => {
            const id_1 = 'test';
            const FileInfoRequestMessage_1 = FileInfoRequestMessage.fromUint8Array(new Uint8Array([MessageType.FileInfoRequest, 116, 101, 115, 116]));
            expect(FileInfoRequestMessage_1).toEqual(new FileInfoRequestMessage(id_1));

            const id_2 = 'f376efd5-14af-4f21-9288-c3f1a1e02f74';
            const FileInfoRequestMessage_2 = FileInfoRequestMessage.fromUint8Array(new Uint8Array([
                MessageType.FileInfoRequest, 
                102, 51, 55, 54, 101, 102, 100, 53, 45, 49, 52, 97, 102, 45, 52, 102, 50, 49, 45, 57, 50, 56, 56, 45, 99, 51, 102, 49, 97, 49, 101, 48, 50, 102, 55, 52]
            ));
            expect(FileInfoRequestMessage_2).toEqual(new FileInfoRequestMessage(id_2));
        });

        it('should parse a message that was serialised by toUint8Array correctly', () => {
            const FileInfoRequestMessage_1 = new FileInfoRequestMessage('test');
            expect(FileInfoRequestMessage.fromUint8Array(FileInfoRequestMessage_1.toUint8Array())).toEqual(FileInfoRequestMessage_1);

            const FileInfoRequestMessage_2 = new FileInfoRequestMessage('Test123');
            expect(FileInfoRequestMessage.fromUint8Array(FileInfoRequestMessage_2.toUint8Array())).toEqual(FileInfoRequestMessage_2);

            const FileInfoRequestMessage_3 = new FileInfoRequestMessage(crypto.randomUUID());
            expect(FileInfoRequestMessage.fromUint8Array(FileInfoRequestMessage_3.toUint8Array())).toEqual(FileInfoRequestMessage_3);
        });
    });

});
