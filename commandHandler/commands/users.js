import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(){
    let users = getUsers();
    let userCount = Object.keys(users).length;

    return sendMessage(
        "message",
        `I've seen ${userCount} users!`
    );
}

export const users = new Command(
    "users",
    "gets total users.",
    ["usrs"],
    [],
    callback
);