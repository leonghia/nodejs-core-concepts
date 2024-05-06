import net from "net";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(data.toString("utf-8"));
  });
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Opened server on", server.address());
});
