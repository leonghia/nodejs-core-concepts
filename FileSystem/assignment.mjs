import fs from "fs/promises";

// Configs
const CREATE_FILE = "create a file";
const DELETE_FILE = "delete the file";
const RENAME_FILE = "rename the file";
const ADD_TO_FILE = "add to the file";
const ERR_CODE = "ENOENT";

// Actions
const createFile = async (path) => {
  try {
    const fileHandle = await fs.open(path, "r");
    console.log("File already exists");
    fileHandle.close();
  } catch (err) {
    const fileHandle = await fs.open(path, "w");
    console.log("File created");
    fileHandle.close();
  }
};

const deleteFile = async (path) => {
  try {
    await fs.unlink(path);
    console.log("File is deleted");
  } catch (err) {
    if (err.code === ERR_CODE) console.log("Path does not exist");
    else console.error(err);
  }
};

const renameFile = async (oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath);
    console.log(`Renamed ${oldPath} to ${newPath}`);
  } catch (err) {
    if (err.code === ERR_CODE) console.log("Path does not exist");
    else console.error(err);
  }
};

const addToFile = async (path, content) => {
  try {
    const fileHandle = await fs.open(path, "a");
    fileHandle.write(content);
    console.log("File content is edited");
    fileHandle.close();
  } catch (e) {
    console.error(err);
  }
};

(async () => {
  const fileHandle = await fs.open("./command.txt", "r");

  fileHandle.on("change", async () => {
    // get the size of the file
    const { size } = await fileHandle.stat();
    // allocate the buffer with the size
    const buffer = Buffer.alloc(size);
    // the location to start filling the buffer
    const offset = 0;
    // how many bytes to read
    const length = buffer.byteLength;
    // read from the start of the file
    const position = 0;

    await fileHandle.read(buffer, offset, length, position);
    const command = buffer.toString("utf-8");

    if (command.includes(CREATE_FILE)) {
      // create a file <path>
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    } else if (command.includes(DELETE_FILE)) {
      // delete the file <path>
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    } else if (command.includes(RENAME_FILE)) {
      // rename the file <oldPath> <newPath>
      const elements = command.split(" ");
      const oldPath = elements[RENAME_FILE.split(" ").length];
      const newPath = elements[RENAME_FILE.split(" ").length + 1];
      renameFile(oldPath, newPath);
    } else if (command.includes(ADD_TO_FILE)) {
      // add to file <path> <content>
      const pathAndContent = command.substring(ADD_TO_FILE.length + 1);
      const [path, ...content] = pathAndContent.split(" ");
      addToFile(path, content.join(" "));
    }
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      fileHandle.emit("change");
    }
  }
})();
