import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js";
import { getRevision, getCurrentRevision, getGitLogByHash, exec } from "../../util.js";
import { getCommands } from "../commandHandler.js";

async function callback(...args){
    try {
        let input = args[args.length - 1]?.text ?? "";
        let query = input.substring(input.indexOf(" ") + 1);
        
        let output = await eval(query); // hacky because args are lowercase
        return getSocket()?.emit("message", "Success: "+output)
    } catch (err){
        return getSocket()?.emit("message", " Failed: "+err)
    }
}

export const loadstring = new Command(
    "loadstring",
    "Loads string.",
    ["ls", "eval", "s"],
    [],
    callback,
    { "loadstring": { hard:true } }
);