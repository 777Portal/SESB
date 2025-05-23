import { Command } from "../commandConstructor.js";
import { getCommands } from "../commandHandler.js";
import { getSocket } from "../../socket.js";
import { getRevision, arrayStringFormat, getCurrentRevision } from "../../util.js";
function helpCallback(message){
    let string = "Help- Prefix: ["+process.env.PREFIX+"] commands:"
    let cmds = getCommands();
    for (let command of cmds){
        if ( !command.checkPermissions(message.fromUser).matches ) continue;
        string+= ` ${command.prefix}${command.name}${arrayStringFormat(command.args)},\n`
    }
    getSocket()?.emit("message", string);
}

export const help = new Command(
    "help",
    "lists available commands",
    ["h"],
    [],
    helpCallback
);