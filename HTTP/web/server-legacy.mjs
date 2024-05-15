import http from "http";
import fs from "fs/promises";

const server = http.createServer();

server.on("request", async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.setHeader("Content-Type", "text/html");
    const fileHandle = await fs.open("./public/index.html", "r");
    const readStream = fileHandle.createReadStream();
    readStream.pipe(res);
  }

  if (req.url === "/styles.css" && req.method === "GET") {
    res.setHeader("Content-Type", "text/css");
    const fileHandle = await fs.open("./public/styles.css", "r");
    const readStream = fileHandle.createReadStream();
    readStream.pipe(res);
  }

  if (req.url === "/script.js" && req.method === "GET") {
    res.setHeader("Content-Type", "text/javascript");
    const fileHandle = await fs.open("./public/script.js", "r");
    const readStream = fileHandle.createReadStream();
    readStream.pipe(res);
  }

  if (req.url === "/login" && req.method === "POST") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    const body = {
      message: "Logging you in...",
    };
    res.end(JSON.stringify(body));
  }

  if (req.url === "/user" && req.method === "PUT") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 401;
    const body = {
      message: "You first have to login.",
    };
    res.end(JSON.stringify(body));
  }

  if (req.url === "/upload" && req.method === "POST") {
    const fileHandle = await fs.open("./storage/image.jpeg", "w"); // create an empty file
    const writeStream = fileHandle.createWriteStream();
    req.pipe(writeStream);
    req.on("end", () => {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 202;
      res.end(JSON.stringify({ message: "File is uploaded." }));
    });
  }
});

server.listen(9000, () => {
  console.log("Webserver is live at http://localhost:9000");
});
