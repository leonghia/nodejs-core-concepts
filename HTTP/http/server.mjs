import http from "http";

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("------- METHOD: -------");
  console.log(req.method);

  console.log("------- URL: -------");
  console.log(req.url);

  console.log("------- HEADERS: -------");
  console.log(req.headers);

  const name = req.headers.name;

  console.log("------- BODY: -------");
  let data = "";
  req.on("data", (chunk) => {
    data += chunk.toString();
  });
  req.on("end", () => {
    const parsed = JSON.parse(data);
    console.log(parsed);
    console.log(name);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `Post with title ${parsed.title} was created by ${name}.`,
      })
    );
  });
});

server.listen(8050, () => {
  console.log("Server listening on http://localhost:8050");
});
