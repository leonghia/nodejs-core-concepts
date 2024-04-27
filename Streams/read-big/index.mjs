import fs from "fs/promises";

(async () => {
  console.time("readBig");
  const fileHandleRead = await fs.open("source.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream();
  const streamWrite = fileHandleWrite.createWriteStream();

  let split = "";

  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");

    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) numbers[0] = split.trim() + numbers[0].trim();
    }

    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }

    numbers.forEach((n) => {
      if (Number(n) % 2 === 0) {
        if (!streamWrite.write(` ${n} `)) streamRead.pause();
      }
    });
  });

  streamWrite.on("drain", () => streamRead.resume());

  streamRead.on("end", () => console.timeEnd("readBig"));
})();
