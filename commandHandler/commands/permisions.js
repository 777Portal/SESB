import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return getSocket()?.emit("message", "I haven't seen " + username + " yet!");
    if (!user.permissions || Object.keys(user.permissions).length == 0) return getSocket()?.emit("message", username+" doesn't have any permisions...");
    return getSocket()?.emit("message", username+" has: "+JSON.stringify(user.permissions));
}

export const permisions = new Command(
    "permisions",
    "lists a user's permisions.",
    ["perms"],
    ["username"],
    callback
);