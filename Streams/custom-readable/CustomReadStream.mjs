import { Readable } from "stream";
import fs from "fs";

export class CustomReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) return callback(err);
      this.fd = fd;
      callback(); // need to invoke callback to proceed
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null); // null is to indicate the end of the stream
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || error));
    } else {
      callback(error); // error can be null, means there's no error
    }
  }
}

const stream = new CustomReadStream({
  highWaterMark: 1800,
  fileName: "text.txt",
});

stream.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});

stream.on("end", () => {
  console.log("Stream is done reading.");
});
