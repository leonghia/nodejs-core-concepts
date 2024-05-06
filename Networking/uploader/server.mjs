import net from "net";
import fs from "fs/promises";

const server = net.createServer(() => {});

server.on("connection", (socket) => {
  console.log("New connection!");

  let fileHandle, writeStream;
  let gotName = false;

  socket.on("data", async (data) => {
    console.log(data.toString("utf-8"));
    if (!fileHandle) {
      socket.pause();
      const indexOfDivider = data.toString("utf-8").indexOf("-------");
      const fileName = data.toString("utf-8").substring(10, indexOfDivider);
      fileHandle = await fs.open(`storage/${fileName}`, "w");
      writeStream = fileHandle.createWriteStream();
      // Writing to the destination file
      if (gotName) {
        writeStream.write(data);
      }

      gotName = true;

      socket.resume();

      writeStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!writeStream.write(data)) {
        socket.pause();
      }
    }
  });

  // This event happens when the client ends the socket
  socket.on("end", () => {
    fileHandle && fileHandle.close();
    fileHandle = undefined;
    writeStream = undefined;
    console.log("Connection ended!");
  });
  socket.on("error", () => {
    console.log("Connection error!");
    fileHandle.close();
  });
});

server.listen(5050, "172.31.2.56", () => {
  console.log("Uploader server is running on", server.address());
});
