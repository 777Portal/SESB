import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username, permision, value, message){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let user = getUsers()[username];
    if (!user) return sendMessage("message", "I haven't seen " + username + " yet!");

    getUsers()[username].permissions ??= {};
    getUsers()[username].permissions[permision] = (value === 'true');

    return sendMessage(
        `${message.fromUser} ${( value === 'true' ) ? "gave" : "took away" } ${permision} from ${username}`
    )
}

export const permision = new Command(
    "permission",
    "modify permission.",
    ["p"],
    ["username", "permision", "value"],
    callback,
    { "operator": { hard:true } }
);