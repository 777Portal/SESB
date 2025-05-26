import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 
import { isSimilar } from "../../util.js";

function callback(username){
    console.log(username)
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    console.log(users[username.trim()], username.trim())
    let user = users[username.trim()];
    if (!user) return sendMessage("message", "I haven't seen " + username + " yet!");
    
    let messageIds = Object.keys(user.messages);
    if (messageIds.length === 0) return sendMessage("message", "No messages found for user " + args);

    let xp = 0;
    let alreadySeen = [];

    for (let messageId in user.messages) {
        let message = user.messages[messageId]
        if (alreadySeen.some(seen => isSimilar(seen, message.text, 1))) continue;
        alreadySeen.push(message.text);
        xp += 0.1 * message.text.length;
    };

    let level = Math.floor(( ( xp ) + 25) / 100);
    return sendMessage(
        "message",
        `${username} - (${level}) DEBUG: XP:${xp} | M:${messageIds.length} | AS:${alreadySeen.length}`
    );
}

export const profile = new Command(
    "profile",
    "profile",
    ["pr", "level"],
    ["username"],
    callback,
    {debug:{}}
);