import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(usernames, permision, value, message){
    let usernameArr = usernames.split(" ")
    
    let unfound = 0;
    let found = 0;

    let users = getUsers();

    for (let rawUsername of usernameArr) {
        let username = rawUsername.includes('#') ? rawUsername : rawUsername + "#twoblade.com";
        username = username.trim();

        let user = users[username];
        if (!user) {
            unfound++;
            console.warn(username + " not found when setting permision")
            continue;
        }

        getUsers()[username].permissions ??= {};
        getUsers()[username].permissions["logging.banned"] = true;
        found++;
    }

    return sendMessage(`${message.fromUser} ${( value === 'true' ) ? "gave" : "took away" } ${permision} ${( value === 'true' ) ? "to" : "from" } ${found} user/s ${unfound > 0 ? ` ( ${unfound} not found in the json )` : ""}`);
}

export const permision = new Command(
    "permission",
    "modify permission.",
    ["p"],
    ["usernames", "permision", "value"],
    callback,
    { "operator": { hard:true } }
);