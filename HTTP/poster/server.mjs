import Butter from "../butter.mjs";

const sessions = [];

const users = [
  { id: 1, name: "Liam Brown", username: "liam23", password: "string" },
  { id: 2, name: "Meredith Green", username: "merit.sky", password: "string" },
  { id: 3, name: "Ben Adams", username: "ben.poet", password: "string" },
];

const posts = [
  {
    id: 1,
    title: "This is a post title",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae purus iaculis, feugiat risus vitae, volutpat mauris. Donec pulvinar lacus eget imperdiet dapibus. Nullam efficitur rutrum lorem. Vestibulum cursus egestas leo. Vivamus sit amet augue semper, vestibulum orci sit amet, auctor nibh. Mauris laoreet iaculis tortor nec finibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus nibh augue, elementum non varius vitae, cursus luctus velit. Nunc venenatis porta diam et tincidunt. Donec ante diam, egestas in sem vitae, fringilla ornare libero. In suscipit dignissim ullamcorper. Integer et vulputate dui. Quisque pellentesque diam sit amet ex imperdiet, non hendrerit magna fermentum. Phasellus ac nulla in justo scelerisque scelerisque ac euismod sem.",
    userId: 1,
  },
];

const PORT = 8000;

const server = new Butter();

// For authentication
server.beforeEach((req, res, next) => {
  const authorizedRoutes = [
    "GET /api/user",
    "PUT /api/user",
    "POST /api/posts",
    "DELETE /api/logout",
  ];
  if (authorizedRoutes.indexOf(req.method + " " + req.url) !== -1) {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];
      const session = sessions.find((s) => s.token === token);
      if (session) {
        req.userId = session.userId;
        return next();
      }
    }
    return res.status(401).end();
  } else {
    next();
  }
});

// For parsing JSON
server.beforeEach((req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    let json = "";
    req.on("data", (chunk) => {
      json += chunk.toString("utf-8");
    });
    req.on("end", () => {
      const parsed = JSON.parse(json);
      req.body = parsed;
      return next();
    });
  } else {
    next();
  }
});

server.beforeEach((req, res, next) => {
  console.log("This is the third middleware function");
  next();
});

// File routes
server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/script.js", (req, res) => {
  res.sendFile("./public/script.js", "text/javascript");
});

// API routes
server.route("get", "/api/posts", (req, res) => {
  const postsToReturn = posts.map((post) => {
    const user = users.find((user) => user.id === post.userId);
    return {
      id: post.id,
      title: post.title,
      body: post.body,
      author: user.name,
    };
  });

  res.status(200).json(postsToReturn);
});

server.route("post", "/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && user.password === password) {
    const token = Math.round(Math.random() * 10_000_000_000).toString();
    sessions.push({ userId: user.id, token });
    res.setHeader("Set-Cookie", `token=${token}; Path=/;`);
    res.status(200).end();
  } else {
    res.status(401).end();
  }
});

server.route("get", "/api/user", (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  res.json({ username: user.username, name: user.name });
});

server.route("delete", "/api/logout", (req, res) => {
  const index = sessions.findIndex((s) => s.userId === req.userId);
  index > -1 && sessions.splice(index, 1);
  res.setHeader(
    "Set-Cookie",
    "token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
  res.status(204).end();
});

server.route("put", "/api/user", (req, res) => {
  const { username, name, password } = req.body;
  // Get the current user
  const user = users.find((u) => u.id === req.userId);
  user.username = username;
  user.name = name;
  user.password = password || user.password;

  res.status(204).end();
});

server.route("post", "/api/post", (req, res) => {
  const { title, body } = req.body;
  const postToCreate = {
    id: posts.length + 1,
    title,
    body,
    userId: req.userId,
  };
  posts.push(postToCreate);
  res.status(201).json(postToCreate);
});

server.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});
