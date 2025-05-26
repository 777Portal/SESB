import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 

function callback(userArray) {
    let users = getUsers();
    let summary = [];

    let usernames = userArray.split(" ")

    let deleted = 0;
    let unfound = 0;
    let found = 0;

    for (let rawUsername of usernames) {
        let username = rawUsername.includes('#') ? rawUsername : rawUsername + "#twoblade.com";
        username = username.trim();

        let user = users[username];
        if (!user) {
            unfound++;
            continue;
        }

        let messages = Object.keys(user.messages).length;
        user.messages = {};

        getUsers()[username].permissions ??= {};
        getUsers()[username].permissions["logging.banned"] = true;

        deleted += messages; 
        found++;
    }

    return sendMessage(`Deleted ${deleted} messages from ${found} users, with ${unfound} users not being found in the json`);
}

export const purge = new Command(
    "purge",
    "purges chat history of a user",
    ["prg"],
    ["usernames (list)"],
    callback,
    {purge: {}}
);