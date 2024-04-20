// import fs from "fs";

// const content = fs.readFileSync("./text.txt");

// console.log(content.toString("utf-8"));

//////////////////////////////////////////

/* Promises API */
import fs from "fs/promises";

(async () => {
  try {
    await fs.copyFile("file.txt", "copied-promises.txt");
  } catch (err) {
    console.error(err);
  }
})();

/* Callback API */
import fs from "fs";

fs.copyFile("file.txt", "copied-callback.txt", (err) => {
  if (err) console.error(err);
});

/* Synchronous API */
import fs from "fs";

fs.copyFileSync("file.txt", "copied-sync.txt");
