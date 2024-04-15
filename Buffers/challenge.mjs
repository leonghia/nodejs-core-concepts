// 0100 1000 0110 1001 0010 0001
import { Buffer } from "buffer";

const buffer = Buffer.alloc(3);

buffer[0] = 0x48;
buffer[1] = 0x69;
buffer[2] = 0x21;

console.log(buffer.toString("utf-8"));
