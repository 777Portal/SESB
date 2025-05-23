import { getToken } from "./login.js";
import { dateDifferenceSeconds, formatTimeSince, getRevision } from "./util.js";
import { getUsers, initJson, logMessage, saveMessages } from "./features/messageLogger.js";
import { initSocket } from "./socket.js";
import { getSummarizationOfQuery } from "./features/search.js";
import { runCommand } from "./commandHandler/commandHandler.js";

let token;
if (!process.env.PLAYWRIGHT){
    token = process.env.FALLBACK_TOKEN
} else {
    token = await getToken(process.env.NAME, process.env.PASSWORD);
}

await initJson();
getUsers()[process.env.OPERATOR].permissions ??= {};
getUsers()[process.env.OPERATOR].permissions.operator = true;

const revision = getRevision();
let socket = initSocket(token);

socket.on("connect_error", (err) => {
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
});

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

socket.on("message", async (message) => {
    logMessage(message);
    runCommand(message);
    
    // if ( message.text.includes(":") ) { 
    //     let split = message.text.split(":")[2];
    //     if (!split) return;
    //     message.text = split.substring(1)
    // }

    // yes arg cms
    // if (command == "=search" ) {
    //     let result = await getSummarizationOfQuery(message.text.Remove(0,6));
    //     // console.log(result)
    //     return socket.emit("message", result.substring(0, 500))
    //     return socket.emit("message", "this command has been temporarly disabled due to it causing a crash. check back later!")
    // }
    process.on('exit', function(){ 
        if (process.env.DEBUG) return process.exit();
        socket.emit("message", "process exited.");
        saveMessages();
        process.exit()
    });

    process.on('SIGINT',  function(){ 
        if (process.env.DEBUG) return process.exit();
        saveMessages();
        socket.emit("message", "process exited by user.");
        process.exit()
    });

    process.on('uncaughtException', function (err) {
        console.error("Uncaught Exception:", err);
        if (socket && socket.emit) {
            socket.emit("message", "Unexpected exception ("+err+") - exiting.");
        }
        saveMessages();
        process.exit(1);
    });
});

setInterval(() => {
    saveMessages();
}, 10000);

console.log('What kinda idiot would log his own token... heh...')