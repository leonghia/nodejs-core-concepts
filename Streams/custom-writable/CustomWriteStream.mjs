import { Writable } from "stream";
import fs from "fs";

export class CustomWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.size = 0;
    this.numbersOfWrites = 0;
  }

  // This will run after the constructor and it will put off calling the other methods until we call the callback function
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // if we call the callback with an argument, it means that we have an error and we should not proceed
        callback(err);
      } else {
        this.fd = fd;
        callback(); // no argument means it was successful
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.size += chunk.length;

    if (this.size > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.size = 0;
        ++this.numbersOfWrites;
        callback();
      });
    } else {
      // when we're done, we should call the callback function
      callback();
    }
  }

  // this method is only called when the "finish" event is triggered
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];
      ++this.numbersOfWrites;
      callback();
    });
  }

  _destroy(error, callback) {
    console.log("Numbers of writes: " + this.numbersOfWrites);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

// const stream = new FileWriteStream({
//   highWaterMark: 1800,
//   fileName: "text.txt",
// });
// stream.write(Buffer.from("this is some string."));
// stream.end(Buffer.from("our last write."));
// stream.on("finish", () => {
//   console.log("Stream was finished.");
// });
