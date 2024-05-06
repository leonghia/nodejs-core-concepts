import net from "net";
import readline from "readline/promises";

const PORT = 4020;
const HOST = "3.25.116.1";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

let clientName;
let clientId;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("Connected to the server!");

  socket.on("data", async (data) => {
    const arr = data.toString("utf-8").split("|");
    if (arr[1] === "id") {
      clientId = arr[2];
    } else {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      if (arr[0] === "System") console.log(arr[2]);
      else
        console.log(`> ${arr[0] === clientName ? "You" : arr[0]}: ${arr[2]}`);
    }
    ask();
  });

  const ask = async () => {
    if (!clientName) {
      clientName = await rl.question("Enter your name > ");
      await moveCursor(0, -1);
      await clearLine(0);
      socket.write(`${clientId}|name|${clientName}`);
      console.log("You joined the conversation.");
    }
    const message = await rl.question("Enter a message > ");
    // Move the cursor one line up according to the Y-axis
    await moveCursor(0, -1);
    // Clear the current line the cursor is in
    await clearLine(0);
    socket.write(`${clientId}|message|${message}`);
  };

  ask();
});

socket.on("end", () => {
  console.log("You left the conversation.");
});
