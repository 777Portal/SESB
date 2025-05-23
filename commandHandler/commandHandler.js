import { help } from "./commands/help.js";
import { debug } from "./commands/debug.js";
import { getSocket } from "../socket.js";

let commands = [help, debug];

export function announceCommandHandlerReady() {
    const socket = getSocket();
    if (socket) socket.emit("message", "Command handler initialized");
}


export function runCommand(string)
{
    for (let command of commands ){
        let status = command.matches(string);
        console.log(status, string)
        if ( !status ) continue;
        if ( status.matches ) return command.run(...status.arguments)
        if ( status.feedback ) return getSocket()?.emit("message", status.feedback);
        console.log("reached end of runcommand with no handler", (status.feedback), (command.status), status, !status )
    }
}