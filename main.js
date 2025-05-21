import { getToken } from "./login.js";
let token = await getToken(process.env.USERNAME, process.env.PASSWORD);

import { io } from "socket.io-client";
const socket = io("https://twoblade.com", {
    path: "/ws/socket.io/",
    "transports": ['websocket'],
    auth: {
        token
    }
});
console.log(socket)

const revision = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim()

socket.on("connect_error", (err) => {
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
});

socket.on("connect", () => {
    socket.emit("message", "BT.");
});

socket.on("disconnect", (reason, details) => {
    console.log(reason, details)
});

socket.on("message", (message) => {
    console.log(message);
});

console.log('What kinda idiot would log his own token... heh...')