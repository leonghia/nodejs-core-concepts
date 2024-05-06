import net from "net";
import fs from "fs/promises";
import path from "path";

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const socket = net.createConnection(
  { host: "3.27.190.152", port: 5050 },
  async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(filePath, "r");
    const readStream = fileHandle.createReadStream();
    const { size } = await fileHandle.stat();

    let bytesRead = 0;
    let temp;

    socket.write(`fileName: ${fileName}-------`);

    // Reading from the source file
    readStream.on("data", async (data) => {
      if (!socket.write(data)) {
        readStream.pause();
      }

      bytesRead += data.length;
      temp = Math.round(bytesRead / size) * 100;
      await moveCursor(0, -1);
      await clearLine(0);
      console.log(`Uploading... ${temp}%`);
    });

    socket.on("drain", () => {
      readStream.resume();
    });

    readStream.on("end", () => {
      console.log("Successfully uploaded!");
      socket.end();
    });
  }
);
