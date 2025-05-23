import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(){
    let users = getUsers();
    let topUsers = Object.entries(users)
        .map(([username, userObj]) => {
            return {
                username,
                count: Object.keys(userObj.messages).length
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    let message = topUsers.map(u => `${u.username} - ${u.count}`).join("\n");

    return getSocket()?.emit("message", "\nTop message senders:\n" + message);
}

export const topmessages = new Command(
    "topmessages",
    "Gets top messages.",
    ["topm"],
    [],
    callback
);