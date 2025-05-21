import { getToken } from "./login.js";
let token = await getToken(process.env.USERNAME, process.env.PASSWORD);

import { execSync } from 'child_process';
const revision = execSync('git rev-parse --short HEAD').toString().trim();

import { io } from "socket.io-client";
const socket = io("https://twoblade.com", {
    path: "/ws/socket.io/",
    "transports": ['websocket'],
    auth: {
        token
    }
});

import { getSummarizationOfQuery } from "./features/search.js";

socket.on("connect_error", (err) => {
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
});

socket.on("connect", () => {
    socket.emit("message", "REV."+revision);
});

socket.on("disconnect", (reason, details) => {
    console.log(reason, details)
});

socket.on ("error", (err) => {
    console.log(err);
})

socket.on("message", async (message) => {
    console.log(message);
    if (message.text.includes("=")) {
        let ror = message.text.split(" ");
        
        let command = ror[0].toLowerCase();
        let args = ror[1];
        console.log(args)

        if (command == "=help" ) return socket.emit("message", `SESB REV.${revision} | current commands: =search, =help`)

        if (command == "=search" ) {
            let result = await getSummarizationOfQuery(message.text);
            return socket.emit("message", result.substring(0, 500))
        }
    }
});

console.log('What kinda idiot would log his own token... heh...')