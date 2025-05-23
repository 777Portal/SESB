import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js";
import { getRevision, getCurrentRevision, getGitLogByHash, exec } from "../../util.js";
import { getCommands } from "../commandHandler.js";

async function callback(string, message){
    try {
        console.log(message.text.split("_")[1])
        let output = await eval(message.text.split("_")[1]); // hacky because args are lowercase
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