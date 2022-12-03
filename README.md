# filesharing-ws-proto  

Protocol for 2-way WebSocket communication used in our filesharing app.  
  
Messages are sequences of bytes. Strings are encoded in `UTF-8`, numbers are stored in little-endian.  

## Messages

- `AckMessage`  
  Type: `MessageType.Ack`
  - `Client <-> Server`

  Used as a generic ACK, anywhere it is required.

- `InfoRequestMessage`  
  Type: `MessageType.InfoRequest`
  - `Uploader <- Server`
  - `Downloader -> Server`
  
  Used to request file information, namely filename and total size in bytes.

- `InfoMessage`  
  Type: `MessageType.Info`  
  - `Uploader -> Server`
  - `Downloader <- Server`

  Used to send file information when requested.

- `ChunkSizeInfoMessage`  
  Type: `MessageType.ChunkSizeInfo`
  - `Uploader <- Server`

  Used by the server to communicate the chunk size that should be used for transferring the file.

- `ChunkRequestMessage`  
  Type: `MessageType.ChunkRequest`
  - `Uploader <- Server`
  - `Downloader -> Server`

  Used to request a chunk by its number, zero-indexed.

- `ChunkMessage`  
  Type: `MessageType.Chunk`
  - `Uploader -> Server`
  - `Downloader <- Server`

  Used to transfer a file chunk. Contains number and chunk bytes.

## Notes

This protocol is to be used by the server (NodeJS) and clients (browser JS). Functionality from NodeJS's `Buffer` is provided to browsers by https://github.com/feross/buffer.
