import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username, index){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return getSocket()?.emit("message", "I haven't seen " + username + " yet!");

    let messageIds = Object.keys(user.messages);
    if ( messageIds.length === 0 ) return getSocket()?.emit("message", "No messages found for user " + username);
    if ( messageIds.length-1 < index || index < 0) return getSocket()?.emit("message", `Invalid index :( max index ${messageIds.length-1}, you tried ${index}` );
    
    let message = user.messages[messageIds[index]];
    let formattedDate = new Date(message.timestamp).toString();
    return getSocket()?.emit(
        "message",
        `${message.text} - ${message.fromUser} (${formattedDate})`
    );
}

export const message = new Command(
    "message",
    "outputs a message by index.",
    ["msg"],
    ["username", "index"],
    callback
);