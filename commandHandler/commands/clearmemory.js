import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { messages } from "../../features/messageLogger.js";

async function callback(){
    messages.length = 0;
    sendMessage('no thoughts head empty')
}

export const clearmemory = new Command(
    "clearmemory",
    "clear ai memory",
    ["cm"],
    [],
    callback,
    { "clearmemory": { hard:true } }
);