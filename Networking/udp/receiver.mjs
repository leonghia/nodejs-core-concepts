import dgram from "dgram";

const receiver = dgram.createSocket("udp4");

receiver.on("message", (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

receiver.bind({ address: "127.0.0.1", port: 8000 });

receiver.on("listening", () => {
  console.log(`Server listening on`, receiver.address());
});
