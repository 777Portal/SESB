import { Command } from "../commandConstructor.js";
import { getSocket } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(username, permision, value, message){
    if ( !username.includes('#') ) username += "#twoblade.com";
    
    let user = getUsers()[username];
    if (!user) return getSocket()?.emit("message", "I haven't seen " + username + " yet!");

    getUsers()[username].permissions ??= {};
    getUsers()[username].permissions[permision] = (value === 'true');

    return getSocket()?.emit(
        "message",
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