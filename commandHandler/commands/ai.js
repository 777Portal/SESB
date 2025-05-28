import { talk } from "../../gemma.js";
import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getMemory } from "../../features/messageLogger.js";

async function callback(query, ...args){
    let messages = args[args.length - 1];
    messages.text = query;

    const userTime = new Date(messages.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let message = `[${userTime}] ${messages.fromUser}: ${query}`

    console.log(getMemory().messages.toString())
    const chatLog = getMemory().messages.map(({ fromUser, text, timestamp }) => {
        const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `[${time}] ${fromUser}: ${text}`;
    }).join('\n');

    let string = await talk(""+message+". \nFor context, here is the chat history."+chatLog+"")
    sendMessage(string);
}

export const ai = new Command(
    "ai",
    "talk to ai",
    ["talk"],
    ["query"],
    callback
);