import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let users = getUsers();
    let user = users[username.trim()];
    if (!user) return sendMessage("I haven't seen " + username + " yet!");

    let messages = Object.keys(user.messages).length;
    users[username.trim()].messages = {};

    return sendMessage("deleted "+messages+" from user " + username + ` ${Object.keys(users[username.trim()].messages).length })`)
}

export const purge = new Command(
    "purge",
    "purges chat history of a user",
    ["prg"],
    ["username"],
    callback,
    {purge: {}}
);