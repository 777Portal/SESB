import { getUsers, initJson } from "./features/messageLogger.js";

await initJson();
let users = await getUsers();

// console.log(users)
for (let username in users){
    let user = users[username];
    if (user.iq == null) continue; // old accounts
    // if (!username.includes("!") && !username.includes("-")) continue;
    if (Object.keys(user.messages).length < 50) continue;
    console.log(username.split("#")[0] + " " )
}