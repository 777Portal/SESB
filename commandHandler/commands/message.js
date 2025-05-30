import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username, index){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return sendMessage("I haven't seen " + username + " yet!");

    let messageIds = Object.keys(user.messages);
    if ( messageIds.length === 0 ) return sendMessage( "No messages found for user " + username);
    if ( messageIds.length-1 < index || index < 0) return sendMessage(`Invalid index :( max index ${messageIds.length-1}, you tried ${index}` );
    
    let message = user?.messages?.[messageIds?.[index]];
    if (!message) return sendMessage( "Message is undefined.. did you send a correct index? (number)" );
    let formattedDate = new Date(message.timestamp).toString();
    return sendMessage(
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