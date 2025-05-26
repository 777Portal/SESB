import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return sendMessage("I haven't seen " + username + " yet!");

    let messages = Object.keys(user.messages).length;
    return sendMessage("Found "+messages+" from user " + username)
}

export const messages = new Command(
    "messages",
    "lists total message count for user.",
    ["msgs"],
    ["username"],
    callback
);