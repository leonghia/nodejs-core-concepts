import http from "http";
import fs from "fs/promises";

class Butter {
  #server;
  #routes;
  #middlewares;

  constructor() {
    this.#server = http.createServer();
    this.#routes = {};
    this.#middlewares = [];
    this.#server.on("request", (req, res) => {
      // Send a file back to the client
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const readStream = fileHandle.createReadStream();
        res.setHeader("Content-Type", mime);
        readStream.pipe(res);
      };

      // Set the status of the response
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      // Send the json data to the client (for small size data, less than the highWaterMark)
      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };

      const runMiddlewares = (req, res, middlewares, index) => {
        if (index === middlewares.length) {
          // If the routes do not have a key of req.method + req.url, we return 404
          if (!this.#routes[req.method.toLowerCase() + req.url]) {
            return res
              .status(404)
              .json({ error: `Cannot ${req.method.toUpperCase()} ${req.url}` });
          }
          this.#routes[req.method.toLowerCase() + req.url](req, res);
        } else {
          middlewares[index](req, res, () => {
            runMiddlewares(req, res, middlewares, index + 1);
          });
        }
      };

      runMiddlewares(req, res, this.#middlewares, 0);
    });
  }

  route(method, path, cb) {
    this.#routes[method + path] = cb;
  }

  beforeEach(cb) {
    this.#middlewares.push(cb);
  }

  listen(port, cb) {
    this.#server.listen(port, cb);
  }
}

export default Butter;
