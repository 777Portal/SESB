import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return getSocket()?.emit("message", "I haven't seen " + username + " yet!");

    let messages = Object.keys(user.messages).length;
    return getSocket()?.emit("message", "Found "+messages+" from user " + username)
}

export const messages = new Command(
    "messages",
    "lists total message count for user.",
    ["msgs"],
    ["username"],
    callback
);