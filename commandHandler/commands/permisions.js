import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return sendMessage("I haven't seen " + username + " yet!");
    if (!user.permissions || Object.keys(user.permissions).length == 0) return getSocket()?.emit("message", username+" doesn't have any permisions...");
    return sendMessage(username+" has: "+JSON.stringify(user.permissions));
}

export const permisions = new Command(
    "permisions",
    "lists a user's permisions.",
    ["perms"],
    ["username"],
    callback
);