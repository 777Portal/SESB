import { getSocket } from "../socket.js";
import { help } from "./commands/help.js";
import { debug } from "./commands/debug.js";
import { seen } from "./commands/lastseen.js";
import { firstSeen } from "./commands/firstseen.js";
import { quote } from "./commands/quote.js";
import { messages } from "./commands/messages.js";
import { message } from "./commands/message.js";
import { topmessages } from "./commands/topmessages.js";
import { messagecount } from "./commands/messagecount.js";
import { users } from "./commands/users.js";
import { permision } from "./commands/perm.js";

let commands = [help, debug, users, messagecount, topmessages, seen, firstSeen, quote, messages, message, permision];

export function getCommands(){
    return commands;
}

export function runCommand(message)
{
    if ( message.text.includes(":") ) { 
        let split = message.text.split(":")[2];
        if (!split) return;
        message.text = split.substring(1)
    }

    for (let command of commands ){
        let status = command.matches(message);
        if ( !status ) continue;
        if ( status.matches ) return command.run(...status.arguments, message)
        if ( status.feedback ) return getSocket()?.emit("message", status.feedback);
        console.log("reached end of runcommand with no handler", (status.feedback), (command.status), status, !status )
    }
}