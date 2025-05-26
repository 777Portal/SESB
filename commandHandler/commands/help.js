import { Command } from "../commandConstructor.js";
import { getCommands } from "../commandHandler.js";
import { sendMessage } from "../../socket.js";
import { getRevision, arrayStringFormat, getCurrentRevision } from "../../util.js";

function helpCallback(verbose, ...args){
    let message = args[args.length-1];
    
    let string = "Help- Prefix: ["+process.env.PREFIX+"] \ncommands:\n"
    let cmds = getCommands();
    for (let command of cmds){
        if ( !command.checkPermissions(message.fromUser).matches ) continue;
        string += command.toString((verbose == 'true'))+"\n";
    }
    sendMessage(string);
}

export const help = new Command(
    "help",
    "lists available commands",
    ["h"],
    { name: "extra info", required: false, default: "false" },
    helpCallback
);