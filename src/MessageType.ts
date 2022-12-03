/**
 * Enum of all known message types.
 *
 * @enum {number}
 */
// NOTE: Use values between 0 and 255 to avoid overflow, as the value is converted to a single byte.
export enum MessageType {
    Ack = 0,

    // Client -> Server
    Info = 1,
    Chunk = 2,

    // Server -> Client
    InfoRequest = 51,
    ChunkSizeInfo = 52,

    // Client <-> Server
    ChunkRequest = 101
}
