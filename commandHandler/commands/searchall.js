import { Command } from "../commandConstructor.js";
import { sendMessage } from "../../socket.js";
import { getUsers } from "../../features/messageLogger.js"; 
import { isSimilar, topNClosest } from "../../util.js";

function callback(query){
    let users = Object.values(getUsers());
    let messages = []

    for (let user of users){
        if ( Object.keys(user.messages).length == 0 ) continue;

        for (let messageId in user.messages) {
            messages.push(user.messages[messageId])
        };
    }
    const results = topNClosest(query, messages, 5);

    let str = '';
    for (let { item, dist } of results) {
      console.log(item);
      str += `[ ${item.text} - ${item.fromUser} (dist: ${dist}) ]\n `;
    }
    
    sendMessage("message", `${query} \n${str}`);    
}

export const searchall = new Command(
    "searchall",
    "searchAll",
    ["sa", "searcha"],
    ["query"],
    callback,
    {search: {}}
);