import fs from "fs/promises";
import { pipeline } from "stream";

// Memory usage: ~1GB
// Execution time: ~900ms
// (async () => {
//   const destinationFile = await fs.open("text-copy.txt", "w");
//   const result = await fs.readFile("source.txt"); // put the whole file into memory
//   await destinationFile.write(result);
// })();

//////////////////////////////////////

// Memory usage: ~20MB
// Execution time: 2s
// (async () => {
//   console.time("copy");

//   const sourceFileHandle = await fs.open("source.txt", "r");
//   const destinationFileHandle = await fs.open("text-copy.txt", "w");

//   let bytesRead = -1;
//   while (bytesRead !== 0) {
//     const chunk = await sourceFileHandle.read(); // put a small portion of the file into memory
//     bytesRead = chunk.bytesRead;

//     if (bytesRead !== 16384) {
//       const index = chunk.buffer.indexOf(0);
//       const buffer = Buffer.alloc(index);
//       chunk.buffer.copy(buffer, 0, 0, index);
//       await destinationFileHandle.write(buffer);
//     } else {
//       await destinationFileHandle.write(chunk.buffer);
//     }
//   }

//   console.timeEnd("copy");
// })();

//////////////////////////////////////

// Memory usage: ~20MB
// Execution time: ~900ms
(async () => {
  console.time("copy");

  const srcFileHandle = await fs.open("source.txt", "r");
  const desFileHandle = await fs.open("text-copy.txt", "w");

  const readStream = srcFileHandle.createReadStream();
  const writeStream = desFileHandle.createWriteStream();

  //   readStream.pipe(writeStream);

  //   readStream.on("end", () => {
  //     console.timeEnd("copy");
  //   });

  pipeline(readStream, writeStream, (err) => {
    console.error(err);
    console.timeEnd("copy");
  });
})();
