import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return sendMessage("I haven't seen " + username + " yet!");

    let messageIds = Object.keys(user.messages);
    let firstMessage = user.messages[ messageIds[0] ];

    let formattedDate = new Date(firstMessage.timestamp).toString();
    return sendMessage(
        `I first saw ${firstMessage.fromUser} @${formattedDate}... They said ${firstMessage.text}!`
    );
}

export const firstSeen = new Command(
    "firstseen",
    "first seen user.",
    [],
    ["username"],
    callback
);