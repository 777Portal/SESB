import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js";
import { getRevision, getCurrentRevision, getGitLogByHash, exec } from "../../util.js";
import { getCommands } from "../commandHandler.js";

async function callback(text){
    try {        
        let output = await eval(text);
        return getSocket()?.emit("message", "Success: "+output)
    } catch (err){
        return getSocket()?.emit("message", " Failed: "+err)
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