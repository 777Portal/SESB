import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(){
    let users = getUsers();
    let userCount = Object.keys(users).length;

    return getSocket()?.emit(
        "message",
        `I've see ${userCount} users!`
    );
}

export const users = new Command(
    "users",
    "gets total users.",
    ["usrs"],
    [],
    callback
);