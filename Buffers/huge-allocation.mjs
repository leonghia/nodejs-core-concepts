import { Buffer } from "buffer";

const buffer = Buffer.alloc(1e9); // 1,000,000,000 bytes (1GB)

setInterval(() => {
  //   for (let i = 0; i < buffer.length; i++) {
  //     // b.length is the size of the buffer in bytes
  //     buffer[i] = 0x22;
  //   }
  buffer.fill(0x22);
}, 5000);
