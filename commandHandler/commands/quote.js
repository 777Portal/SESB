import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username){
    console.log(username)
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    console.log(users[username.trim()], username.trim())
    let user = users[username.trim()];
    if (!user) return sendMessage("I haven't seen " + username + " yet!");

    let messageIds = Object.keys(user.messages);
    if (messageIds.length === 0) return sendMessage("No messages found for user " + args);

    let randomId = messageIds[Math.floor(Math.random() * messageIds.length)];
    let randomMessage = user.messages[randomId];

    let formattedDate = new Date(randomMessage.timestamp).toString();
    return sendMessage(
        `${randomMessage.text} - ${randomMessage.fromUser} (${formattedDate})`
    );
}

export const quote = new Command(
    "quote",
    "quote a user",
    ["q"],
    ["username"],
    callback
);