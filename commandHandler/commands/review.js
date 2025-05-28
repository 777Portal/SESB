import { review } from "../../gemma.js";
import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";

async function callback(query, ...args){
    let message = args[args.length-1]
    message.fromIQ = 43
    console.log(message)
    let string = await review(JSON.stringify(message))

    sendMessage(string);
}

export const reviewCommand = new Command(
    "review",
    "review",
    ["r"],
    ["query"],
    callback
);