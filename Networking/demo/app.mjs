import http from "http";

const port = 4080;
const hostname = "192.168.2.7";

const server = http.createServer((req, res) => {
  const data = { message: "Hi Nghia! You will be very successful." };
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Connection", "close");
  res.statusCode = 200;
  res.end(JSON.stringify(data));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
