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
import { loadstring } from "./commands/loadstring.js";
import { permisions } from "./commands/permisions.js";
import { permisionSearch } from "./commands/permisionSeach.js";
import { profile } from "./commands/profile.js";
import { searchall } from "./commands/searchall.js";
import { purge } from "./commands/purge.js";
import { reviewCommand } from "./commands/review.js";
import { webhook } from "./commands/webhook.js";

let commands = [help, debug, users, messagecount, topmessages, seen, searchall, profile, firstSeen, quote, messages, message, permision, loadstring, permisions, permisionSearch, purge, reviewCommand, webhook];

export function getCommands(){
    return commands;
}

export function runCommand(message)
{
    if (message.fromUser == process.env.NAME+"#twoblade.com") return; // assuming we are on twoblade domain and that it doesn't already have it but idrw to do allat

    if ( message.text.includes(":") ) { 
        let split = message.text.split(":")[1];
        if (!split) return console.log(message.text.split(":"));
        
        message.text = split.substring(1)
    }

    message.text = message.text.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');

    for (let command of commands ){
        let status = command.matches(message);
        if ( !status ) continue;
        if ( status.matches ) return command.run(...status.arguments, message)
        if ( status.feedback ) return getSocket()?.emit("message", status.feedback);
        console.log("reached end of runcommand with no handler", (status.feedback), (command.status), status, !status )
    }
}