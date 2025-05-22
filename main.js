import { getToken } from "./login.js";

let token;
if (!process.env.PLAYWRIGHT){
    token = process.env.FALLBACK_TOKEN
} else {
    token = await getToken(process.env.NAME, process.env.PASSWORD);
}

import { getUsers, initJson, logMessage, saveMessages } from "./features/messageLogger.js";
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
import { dateDifferenceSeconds } from "./util.js";

socket.on("connect_error", (err) => {
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
});

setInterval(() => {
    saveMessages();
}, 10000);

socket.on("connect", () => {
    if (process.env.DEBUG) return;
    socket.emit("message", "REV."+revision+" | =help");
});

socket.on("disconnect", (reason, details) => {
    console.log(reason, details)
});

socket.on ("error", (err) => {
    console.log(err);
})

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

socket.on("message", async (message) => {
    logMessage(message);
    
    if ( message.text.includes(":") ) { 
        let split = message.text.split(":")[2];
        if (!split) return;
        message.text = split.substring(1)
    }

    if (message.text.includes("=") ) {
        let ror = message.text.split(" ");
        
        let command = ror[0].toLowerCase();
        let args = ror[1];        

        // no arg cmds
        if (command == "=help" ) return socket.emit("message", `SESB REV.${revision} | current commands:  =help, =users, =messagecount, =search [bing search query], =messages [username], =message [username] [index], =quote [username], =firstseen [username], =lastseen [username]`)

        if (command == "=?" ) { 
            const memoryData = process.memoryUsage();
            const heapTotal = formatMemoryUsage(memoryData.heapTotal)
            const heapUsed = formatMemoryUsage(memoryData.heapUsed)

            return socket.emit("message", `SESB REV.${revision} | (${heapUsed} / ${heapTotal})`) 
        }

        if (command == "=users") {
            let users = getUsers();        
            
            let userCount = Object.keys(users).length;                
            return socket.emit(
                "message",
                `I currently know of ${userCount} users.`
            );
        }

        if (command == "=messagecount") {
            let users = getUsers();
            let messageCount = 0;
        
            for (const userName in users) {
                let user = users[userName];
                if (user && user.messages) {
                    messageCount += Object.keys(user.messages).length;
                }
            }
        
            return socket.emit(
                "message",
                `I see ${messageCount} messages.`
            );
        }
        
        if (!args) return socket.emit("message", "No arguments. Did you type the command right?");

        // yes arg cms
        if (command == "=search" ) {
            let result = await getSummarizationOfQuery(message.text.Remove(0,6));
            return socket.emit("message", result.substring(0, 500))
        }

        if (command == "=message" ) {
            let users = getUsers();
            if (!ror[2]) return socket.emit("message", "You need an index for that!")
            if ( !args.includes('#') ) args += "#twoblade.com";
            
            let user = users[args];
            if ( !user ) return socket.emit("message", "couldn't find user " + args + "...")

            let messageIds = Object.keys(user.messages);
            if ( messageIds.length === 0 ) return socket.emit("message", "No messages found for user " + args);
            if ( messageIds.length-1 < ror[2] || ror[2] < 0) return socket.emit("message", "Invalid index... max: " + messageIds.length-1);
            
            let message = user.messages[messageIds[ror[2]]];

            let formattedDate = new Date(message.timestamp).toString();
            return socket.emit(
                "message",
                `${message.text} - ${message.fromUser} (${formattedDate})`
            );
        }

        if (command == "=messages" ) {
            let users = getUsers();
            if ( !args.includes('#') ) args += "#twoblade.com";
            let user = users[args];
            console.log(users, args)
            
            if (!user) return socket.emit("message", "couldn't find user " + args + "...")
            
            let messages = Object.keys(user.messages).length;
            return socket.emit("message", "Found "+messages+" from user " + args)
        }
        
        if (command == "=quote") {
            let users = getUsers();
            if ( !args.includes('#') ) args += "#twoblade.com";
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

        if (command == "=firstseen") {
            let users = getUsers();
            if ( !args.includes('#') ) args += "#twoblade.com";
            let user = users[args.trim()];
            if (!user) return socket.emit("message", "I haven't seen " + args + " yet!");
        
            let messageIds = Object.keys(user.messages);
            let randomMessage = user.messages[ messageIds[0] ];
        
            let formattedDate = new Date(randomMessage.timestamp).toString();
            return socket.emit(
                "message",
                `I first saw ${randomMessage.fromUser} @${formattedDate}... They said ${randomMessage.text}!`
            );
        }

        if (command == "=lastseen") {
            let users = getUsers();
            if ( !args.includes('#') ) args += "#twoblade.com";
            let user = users[args.trim()];
            if (!user) return socket.emit("message", "I haven't seen " + args + " yet!");
        
            let messageIds = Object.keys(user.messages);
            let lastMessage = user.messages[ messageIds[ messageIds.length - 1 ] ];
        
            let date = new Date(lastMessage.timestamp);
            const difference = ( dateDifferenceSeconds(date, new Date()) / 60 ).toFixed(2);
            return socket.emit(
                "message",
                `I last saw ${lastMessage.fromUser} ${difference} minutes ago... They said ${lastMessage.text}!`
            );
        }
    }
    process.on('exit', function(){ 
        socket.emit("message", "process exited.");
        saveMessages();
        process.exit()
    });

    process.on('SIGINT',  function(){ 
        socket.emit("message", "process exited by user.");
        saveMessages();
        process.exit()
    });

    process.on('uncaughtException',  function(){ 
        socket.emit("message", "unexpected exception - exiting.");
        saveMessages();
        process.exit(1)
    });
});



console.log('What kinda idiot would log his own token... heh...')