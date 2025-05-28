import { talk } from "../../gemma.js";
import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";

async function callback(query, ...args){
    let string = await talk(JSON.stringify(query))
    sendMessage(string);
}

export const ai = new Command(
    "ai",
    "talk to ai",
    ["talk"],
    ["query"],
    callback
);