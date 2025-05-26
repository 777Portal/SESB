import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(){
    let users = getUsers();
    let messageCount = 0;
        
    for (const userName in users) {
        let user = users[userName];
        if (user && user.messages) {
            messageCount += Object.keys(user.messages).length;
        }
    }

    return sendMessage(
        `I see ${messageCount} messages.`
    );
}

export const messagecount = new Command(
    "messagecount",
    "gets total amount of messages.",
    ["msgc", "msgcount", "messagec"],
    [],
    callback
);