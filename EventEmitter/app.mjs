import { EventEmitter } from "./events.mjs";

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

myEmitter.on("foo", () => {
  console.log("An event occured 1.");
});

myEmitter.on("foo", () => {
  console.log("An event occured 2.");
});

myEmitter.on("foo", (x) => {
  console.log(`An event with parameter ${x} occured.`);
});

myEmitter.on("bar", () => {
  console.log("An event occured bar.");
});

// Run the listener for one time only
// myEmitter.once("bar", () => {
//   console.log("An event occured bar.");
// });

myEmitter.emit("foo", "some text");
myEmitter.emit("bar");
