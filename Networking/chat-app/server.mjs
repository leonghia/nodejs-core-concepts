import net from "net";

const PORT = 4020;
const HOST = "172.31.2.56";

const server = net.createServer();

// Keep track of all the sockets
const clients = [];

const handleClientLeave = (clients, clientId) => {
  const clientName = findClient(clientId).name;
  clients.forEach((client) => {
    // System|message|Nghia left.
    client.socket.write(`System|message|${clientName} left.`);
  });
};

const findClient = (clientId) =>
  clients.find((client) => client.id === clientId);

server.on("connection", (socket) => {
  console.log("A new connection to the server.");

  const clientId = new Date().getTime().toString();

  socket.on("data", (data) => {
    // 3214153|name|nghia
    // 3214153|message|Hi this is a message.
    const str = data.toString("utf-8");
    const arr = str.split("|");
    if (arr[1] === "name") {
      // Add client to the list
      clients.push({ id: clientId, name: arr[2], socket });
      socket.write(`${clientId}|id|${clientId}`);
      // Notify other members
      clients.forEach((client) => {
        if (client.id !== clientId) {
          client.socket.write(
            `System|message|${arr[2]} joined the conversation.`
          );
        }
      });
    } else if (arr[1] === "message") {
      // New message
      const clientName = findClient(clientId).name;
      clients.forEach((client) => {
        client.socket.write(`${clientName}|message|${arr[2]}`);
      });
    }
  });

  socket.on("end", () => {
    handleClientLeave(clients, clientId);
  });

  socket.on("error", () => {
    handleClientLeave(clients, clientId);
  });
});

server.listen(PORT, HOST, () => {
  console.log("Opened server on", server.address());
});
