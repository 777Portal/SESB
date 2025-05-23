import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 
import { formatTimeSince } from "../../util.js";

function callback(username){
    console.log(username)
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return socket.emit("message", "I haven't seen " + username + " yet!");

    let messageIds = Object.keys(user.messages);
    let lastMessage = user.messages[ messageIds[ messageIds.length - 1 ] ];

    let difference = formatTimeSince(lastMessage.timestamp);

    return getSocket()?.emit(
        "message",
        `I last saw ${lastMessage.fromUser} ${difference} ago... They said ${lastMessage.text}!`
    );
}

export const seen = new Command(
    "seen",
    "last seen user.",
    ["lastseen"],
    ["username"],
    callback
);