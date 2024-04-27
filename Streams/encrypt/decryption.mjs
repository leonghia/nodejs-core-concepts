import { Transform } from "stream";
import fs from "fs/promises";

export class Decryption extends Transform {
  constructor(fileSize) {
    super();
    this.fileSize = fileSize;
    this.bytesRead = 0;
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) {
        chunk[i] = chunk[i] - 1;
      }
      this.bytesRead += 1;
      if (this.bytesRead % 10 === 0 || this.bytesRead === this.fileSize) {
        console.log(
          `Decrypting: ${Math.round((this.bytesRead / this.fileSize) * 100)}%`
        );
      }
    }
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("encrypted.txt", "r");
  const writeFileHandle = await fs.open("decrypted.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const { size } = await readFileHandle.stat();

  const decryption = new Decryption(size);

  readStream.pipe(decryption).pipe(writeStream);
})();
