import http from "http";

// An agent is for establishing a TCP connection
const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent,
  hostname: "localhost",
  port: 8050,
  method: "POST",
  path: "/create-post",
  headers: {
    "Content-Type": "application/json",
    name: "Nghia",
  },
});

// This event is emitted only once
request.on("response", (response) => {
  console.log("------- STATUS: -------");
  console.log(response.statusCode);

  console.log("------- HEADERS: -------");
  console.log(response.headers);

  console.log("------- BODY: -------");
  response.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
  response.on("end", () => {
    console.log("No more data.");
  });
});

request.end(
  JSON.stringify({
    title: "Title of my post",
    body: "This is some text and more and more.",
  })
);
