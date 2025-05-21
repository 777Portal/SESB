import { getToken } from "./login.js";
let token = await getToken(process.env.USERNAME, process.env.PASSWORD);

import { execSync } from 'child_process';
const revision = execSync('git rev-parse HEAD').toString().trim();

import { io } from "socket.io-client";
const socket = io("https://twoblade.com", {
    path: "/ws/socket.io/",
    "transports": ['websocket'],
    auth: {
        token
    }
});

socket.on("connect_error", (err) => {
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
});

socket.on("connect", () => {
    socket.emit("message", "BT."+revision);
});

socket.on("disconnect", (reason, details) => {
    console.log(reason, details)
});

socket.on("message", (message) => {
    console.log(message);
});

console.log('What kinda idiot would log his own token... heh...')