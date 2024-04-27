import { Duplex } from "stream";
import fs from "fs";

export class CustomDuplexStream extends Duplex {
  constructor({
    readableHighWaterMark,
    writableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ readableHighWaterMark, writableHighWaterMark });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.readFd = null;
    this.writeFd = null;
    this.chunks = [];
    this.size = 0;
  }

  _construct(callback) {
    fs.open(this.readFileName, "r", (err, readFd) => {
      if (err) return callback(err);
      this.readFd = readFd;
      fs.open(this.writeFileName, "w", (err, writeFd) => {
        if (err) return callback(err);
        this.writeFd = writeFd;
        callback();
      });
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.size += chunk.length;

    if (this.size > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.size = 0;
        callback();
      });
    } else {
      // when we're done, we should call the callback function
      callback();
    }
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.readFd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null); // null is to indicate the end of the stream
    });
  }

  // this method is only called when the "finish" event is triggered
  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);
      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    callback(error);
  }
}

const duplex = new CustomDuplexStream({
  readFileName: "read.txt",
  writeFileName: "write.txt",
});
