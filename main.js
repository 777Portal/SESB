import { getToken } from "./login.js";
let token = await getToken(process.env.USERNAME, process.env.PASSWORD);


import { getUsers, initJson, logMessage, saveMessages } from "./features/logger.js";
await initJson();

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

setInterval(() => {
    saveMessages();
}, 10000);

socket.on("connect", () => {
    socket.emit("message", "REV."+revision+" | =help");
});

socket.on("disconnect", (reason, details) => {
    console.log(reason, details)
});

socket.on ("error", (err) => {
    console.log(err);
})

socket.on("message", async (message) => {
    logMessage(message);
    
    console.log(message);
    if (message.text.includes("=")) {
        let ror = message.text.split(" ");
        
        let command = ror[0].toLowerCase();
        let args = ror[1];
        console.log(args)

        if (command == "=help" ) return socket.emit("message", `SESB REV.${revision} | current commands: =search, =help, =messages, =quote`)

        if (command == "=search" ) {
            let result = await getSummarizationOfQuery(message.text);
            return socket.emit("message", result.substring(0, 500))
        }

        if (command == "=messages" ) {
            let users = getUsers();
            let user = users[args];
            console.log(users, args)
            if (!user) return socket.emit("message", "couldn't find user " + args + "...")
            let messages = Object.keys(user.messages).length;
            return socket.emit("message", "Found "+messages+" from user " + args)
        }
        if (command == "=quote") {
            let users = getUsers();
            let user = users[args.trim()];
            if (!user) return socket.emit("message", "couldn't find user " + args + "...");
        
            let messageIds = Object.keys(user.messages);
            if (messageIds.length === 0) return socket.emit("message", "No messages found for user " + args);
        
            let randomId = messageIds[Math.floor(Math.random() * messageIds.length)];
            let randomMessage = user.messages[randomId];
        
            let formattedDate = new Date(randomMessage.timestamp).toString();
            return socket.emit(
                "message",
                `${randomMessage.text} - ${randomMessage.fromUser} (${formattedDate})`
            );
        }
    }
    process.on('exit', function(){ 
        socket.emit("message", "process exited.");
        saveMessages();
    });
});



console.log('What kinda idiot would log his own token... heh...')