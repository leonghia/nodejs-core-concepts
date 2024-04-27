/* Promises FS */
// Execution time: ~8s
// CPU usage: 100% (single core)
// Memory usage: ~50MB
// import fs from "fs/promises";

// (async () => {
//   console.time("writeMany");

//   const fileHandle = await fs.open("hello.txt", "w");

//   for (let i = 0; i < 1_000_000; i++) {
//     const buffer = Buffer.from(` ${i} `, "utf-8");
//     await fileHandle.write(buffer);
//   }

//   console.timeEnd("writeMany");
// })();

/////////////////////////////////////

/* Callback FS */
// Execution time: ~2s
// CPU usage: 100% (single core)
// Memory usage: ~500MB
// import fs from "fs";

// (async () => {
//   console.time("writeMany");

//   fs.open("text.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1_000_000; i++) {
//       const buffer = Buffer.from(` ${i} `, "utf-8");
//       fs.write(fd, buffer, () => {});
//     }

//     console.timeEnd("writeMany");
//   });
// })();

/////////////////////////////////////

/* Synchronous FS */
// Execution time: ~2s
// CPU usage: 100% (single core)
// Memory usage: ~50MB
// import fs from "fs";

// (async () => {
//   console.time("writeMany");

//   fs.open("text.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1_000_000; i++) {
//       const buffer = Buffer.from(` ${i} `, "utf-8");
//       fs.writeSync(fd, buffer);
//     }

//     console.timeEnd("writeMany");
//   });
// })();

/////////////////////////////////////

/* Don't do it this way as it is not memory efficient */
/* Promises FS using streams */
// Execution time: ~280ms
// CPU usage: 100% (single core)
// Memory usage: ~150MB
// import fs from "fs/promises";

// (async () => {
//   console.time("writeMany");

//   const fileHandle = await fs.open("hello.txt", "w");

//   const stream = fileHandle.createWriteStream();

//   for (let i = 0; i < 1_000_000; i++) {
//     const buffer = Buffer.from(` ${i} `, "utf-8");
//     stream.write(buffer);
//   }

//   console.timeEnd("writeMany");
// })();

/////////////////////////////////////

/* This is how we should do it */
/* Promises FS using streams */
// Execution time: ~280ms
// CPU usage: 100% (single core)
// Memory usage: ~50MB

// import fs from "fs/promises";
import { CustomWriteStream } from "../custom-writable/CustomWriteStream.mjs"; // using our custom stream

(async () => {
  console.time("writeMany");
  // const stream = fileHandle.createWriteStream();
  const stream = new CustomWriteStream({
    highWaterMark: 1800,
    fileName: "text.txt",
  });

  // console.log(stream.writableHighWaterMark); // 16384 bytes
  // console.log(stream.writableLength); // how much the internal buffer of this stream is filled

  // const buffer = Buffer.alloc(1e8, "a"); // 1e8 = 100,000,000
  // const buffer = Buffer.alloc(16384, "a");
  // console.log(stream.write(buffer));
  // console.log(stream.write(Buffer.alloc(1, "a")));

  // Whenever the internal buffer is emptied, it will trigger the drain event
  // stream.on("drain", () => {
  //   console.log("We are now safe to write more");
  // });

  let i = 0;
  const numbersOfWrites = 1000;
  const writeMany = () => {
    while (i < numbersOfWrites) {
      const buffer = Buffer.from(` ${i} `, "utf-8");
      // this is the last write
      if (i === numbersOfWrites - 1) {
        return stream.end(buffer); // one final additional chunk
      }
      i++;
      if (!stream.write(buffer)) break;
    }
  };

  writeMany();

  let numbersOfDrains = 0;

  // resume the loop whenever the stream's internal buffer is emptied
  stream.on("drain", () => {
    ++numbersOfDrains;
    writeMany();
  });

  stream.on("finish", () => {
    console.log("Numbers of drains: " + numbersOfDrains);
    console.timeEnd("writeMany");
  });
})();
