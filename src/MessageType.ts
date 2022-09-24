/**
 * Enum of all known message types.
 * 
 * @enum {number}
 */
// NOTE: Use values between 0 and 255 to avoid overflow, as the value is converted to a single byte.
export enum MessageType {
    Ack = 0,

    FileInfo = 1,
    FileChunk = 2,

    FileInfoRequest = 51,
    UploadStartReq = 52,
}
