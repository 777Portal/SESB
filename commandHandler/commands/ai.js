import { talk } from "../../gemma.js";
import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";

async function callback(query, ...args){
    let string = await talk(args[args.length-1].fromUser+": "+query+"")
    sendMessage(string);
}

export const ai = new Command(
    "ai",
    "talk to ai",
    ["talk"],
    ["query"],
    callback
);