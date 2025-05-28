import { getToken } from "./login.js";
import { dateDifferenceSeconds, formatTimeSince, getRevision, sendWebhook } from "./util.js";
import { getUsers, initJson, logMessage, saveMessages } from "./features/messageLogger.js";
import { initSocket } from "./socket.js";
import { getSummarizationOfQuery } from "./features/search.js";
import { runCommand } from "./commandHandler/commandHandler.js";
import { review } from "./gemma.js";

let token;
if (!process.env.PLAYWRIGHT){
    token = process.env.FALLBACK_TOKEN
} else {
    token = await getToken(process.env.NAME, process.env.PASSWORD, process.env.CF_CLEARANCE);
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

    if (message.fromUser == process.env.NAME+"#twoblade.com" || message.fromUser == "fivecord#twoblade.com") return; // assuming we are on twoblade domain and that it doesn't already have it but idrw to do allat
    if (getUsers()[message.fromUser].permissions["logging.banned"] == true) return;

    let removed = message
    delete message.fromIQ
    delete message.id
    delete message.timestamp
    
    let rating = await review(JSON.stringify(removed))
    rating = JSON.parse(rating)
    
    console.log(rating?.rating, rating)
    let string = " ("+rating?.rating+") "  + rating.reason
    if (rating?.rating > 4) sendWebhook(string, message.fromUser, message.text, rating.toString())
});

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

setInterval(() => {
    saveMessages();
}, 10000);

console.log('What kinda idiot would log his own token... heh...')