import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js";
import { getRevision, getCurrentRevision, getGitLogByHash, exec, sendWebhook } from "../../util.js";
import { getCommands } from "../commandHandler.js";

async function callback(text){
    try {        
        let output = await eval(text);
        return sendMessage("Success: "+output)
    } catch (err){
        return sendMessage(" Failed: "+err)
    }
}

export const loadstring = new Command(
    "loadstring",
    "Loads string.",
    ["ls", "eval", "s"],
    ["text"],
    callback,
    { "loadstring": { hard:true } }
);