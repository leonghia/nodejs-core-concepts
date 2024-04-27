import { Transform } from "stream";
import fs from "fs/promises";

export class Encryption extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) {
        chunk[i] = chunk[i] + 1;
      }
    }
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("decrypted.txt", "r");
  const writeFileHandle = await fs.open("encrypted.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const encryption = new Encryption();

  readStream.pipe(encryption).pipe(writeStream);
})();
